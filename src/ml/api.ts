import type { Demographic, PredictionResult, ModelMetrics, DatasetStats, TrainingOptions } from '../types';
import { preprocessData, splitTrainTest, extractFeaturesFromDemographic } from './preprocessing';
import { RandomForestClassifier } from './models/randomForest';
import { GradientBoostingClassifier } from './models/gradientBoosting';
import { NeuralNetwork } from './models/neuralNetwork';
import { sampleNameData, extendedNameData } from './data/sampleData';

// Store trained models for later use
let randomForestModel: RandomForestClassifier | null = null;
let gradientBoostingModel: GradientBoostingClassifier | null = null;
let neuralNetworkModel: NeuralNetwork | null = null;

// Store training and test data
let trainData: any[] = [];
let testData: any[] = [];

/**
 * Trains ML models with the provided options
 */
export async function trainModels(options: TrainingOptions): Promise<ModelMetrics> {
  console.log('Starting model training with options:', options);
  
  // In a real application, we would load real data here
  // For demo purposes, we'll use our sample data
  const rawData = options.modelType === 'randomForest' ? extendedNameData : sampleNameData;
  
  // Preprocess data
  const processedData = preprocessData(rawData);
  
  // Split into training and test sets
  const { train, test } = splitTrainTest(processedData, options.trainTestSplit);
  trainData = train;
  testData = test;
  
  let accuracy = 0;
  const startTime = performance.now();
  
  // Train the appropriate model
  switch (options.modelType) {
    case 'randomForest':
      randomForestModel = new RandomForestClassifier(20, 7);
      randomForestModel.train(trainData);
      accuracy = randomForestModel.evaluate(testData).accuracy;
      break;
      
    case 'gradientBoosting':
      gradientBoostingModel = new GradientBoostingClassifier(15, 0.1);
      gradientBoostingModel.train(trainData);
      accuracy = gradientBoostingModel.evaluate(testData).accuracy;
      break;
      
    case 'neuralNetwork': {
      // Determine input size from the first sample
      const inputSize = Object.keys(trainData[0].features).length;
      neuralNetworkModel = new NeuralNetwork(inputSize, 15, 0.05);
      neuralNetworkModel.train(trainData, 200);
      accuracy = neuralNetworkModel.evaluate(testData).accuracy;
      break;
    }
      
    case 'lstm':
    case 'transformer':
      // These would be more complex to implement in JavaScript
      // For demo purposes, we'll use the neural network as a fallback
      console.log(`${options.modelType} not fully implemented, using Neural Network instead`);
      const inputSize = Object.keys(trainData[0].features).length;
      neuralNetworkModel = new NeuralNetwork(inputSize, 20, 0.05);
      neuralNetworkModel.train(trainData, 300);
      accuracy = neuralNetworkModel.evaluate(testData).accuracy;
      break;
      
    default:
      throw new Error(`Unknown model type: ${options.modelType}`);
  }
  
  const endTime = performance.now();
  const trainingTime = endTime - startTime;
  
  // Generate random but realistic metrics for demo purposes
  // In a real application, these would be calculated from the model evaluation
  const metrics: ModelMetrics = {
    accuracy,
    precision: 0.75 + Math.random() * 0.2,
    recall: 0.7 + Math.random() * 0.25,
    f1Score: 0.72 + Math.random() * 0.23,
    confusionMatrix: [
      [Math.floor(Math.random() * 50), Math.floor(Math.random() * 10)],
      [Math.floor(Math.random() * 15), Math.floor(Math.random() * 45)]
    ],
    biasMetrics: {
      genderBias: Math.random() * 0.3,
      ageBias: Math.random() * 0.25,
      locationBias: Math.random() * 0.2,
      educationBias: Math.random() * 0.15,
      ethnicityBias: Math.random() * 0.35
    }
  };
  
  console.log(`Model training completed in ${trainingTime.toFixed(2)}ms with accuracy: ${accuracy.toFixed(4)}`);
  
  return metrics;
}

/**
 * Makes predictions using the trained model
 */
export async function predictName(demographic: Demographic): Promise<PredictionResult> {
  const startTime = performance.now();
  
  // Check if any model is trained
  if (!randomForestModel && !gradientBoostingModel && !neuralNetworkModel) {
    throw new Error('No trained model available. Please train a model first.');
  }
  
  // Extract features
  const features = extractFeaturesFromDemographic(demographic);
  
  // Make prediction using the best available model
  let predictions;
  let modelUsed = '';
  
  if (neuralNetworkModel) {
    predictions = neuralNetworkModel.predict(features);
    modelUsed = 'Neural Network';
  } else if (gradientBoostingModel) {
    predictions = gradientBoostingModel.predict(features);
    modelUsed = 'Gradient Boosting';
  } else if (randomForestModel) {
    predictions = randomForestModel.predict(features);
    modelUsed = 'Random Forest';
  } else {
    throw new Error('No trained model available');
  }
  
  const endTime = performance.now();
  const processingTime = endTime - startTime;
  
  // Calculate an overall confidence score (weighted average of top predictions)
  const overallConfidence = predictions.reduce((sum, pred, index) => 
    sum + pred.confidence * (3 - index) / 6, 0);
  
  // Calculate data quality score (simplified for demo)
  const dataQuality = 0.7 + Math.random() * 0.3;
  
  return {
    names: predictions,
    metadata: {
      processingTime,
      modelUsed,
      confidence: overallConfidence,
      dataQuality
    }
  };
}

/**
 * Gets dataset statistics
 */
export function getDatasetStats(): DatasetStats {
  // In a real application, this would analyze the actual dataset
  // For demo purposes, we'll generate realistic statistics
  
  const totalRecords = extendedNameData.length;
  const uniqueNames = new Set(extendedNameData.map(item => item.name)).size;
  
  return {
    totalRecords,
    uniqueNames,
    missingValues: {
      age: 0,
      gender: 0,
      location: Math.floor(Math.random() * 3),
      educationLevel: Math.floor(Math.random() * 2),
      ethnicity: Math.floor(Math.random() * 4)
    },
    ageDistribution: {
      '18-24': Math.floor(totalRecords * 0.15),
      '25-34': Math.floor(totalRecords * 0.25),
      '35-44': Math.floor(totalRecords * 0.2),
      '45-54': Math.floor(totalRecords * 0.15),
      '55-64': Math.floor(totalRecords * 0.15),
      '65+': Math.floor(totalRecords * 0.1)
    },
    genderDistribution: {
      male: Math.floor(totalRecords * 0.48),
      female: Math.floor(totalRecords * 0.48),
      nonbinary: Math.floor(totalRecords * 0.03),
      other: Math.floor(totalRecords * 0.01)
    },
    locationDistribution: {
      Northeast: Math.floor(totalRecords * 0.25),
      Midwest: Math.floor(totalRecords * 0.25),
      South: Math.floor(totalRecords * 0.3),
      West: Math.floor(totalRecords * 0.2)
    },
    educationDistribution: {
      'high-school': Math.floor(totalRecords * 0.3),
      'some-college': Math.floor(totalRecords * 0.2),
      'bachelors': Math.floor(totalRecords * 0.3),
      'masters': Math.floor(totalRecords * 0.15),
      'doctorate': Math.floor(totalRecords * 0.05)
    },
    ethnicityDistribution: {
      White: Math.floor(totalRecords * 0.6),
      Black: Math.floor(totalRecords * 0.12),
      Hispanic: Math.floor(totalRecords * 0.15),
      Asian: Math.floor(totalRecords * 0.08),
      'Middle Eastern': Math.floor(totalRecords * 0.03),
      Other: Math.floor(totalRecords * 0.02)
    }
  };
}