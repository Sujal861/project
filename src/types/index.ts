export interface Demographic {
  age: number;
  gender: 'male' | 'female' | 'nonbinary' | 'other';
  location: string;
  educationLevel: 'high-school' | 'some-college' | 'bachelors' | 'masters' | 'doctorate' | 'other';
  ethnicity: string;
}

export interface PredictionResult {
  names: NamePrediction[];
  metadata: {
    processingTime: number;
    modelUsed: string;
    confidence: number;
    dataQuality: number;
  };
}

export interface NamePrediction {
  name: string;
  confidence: number;
  rank: number;
}

export interface DatasetStats {
  totalRecords: number;
  uniqueNames: number;
  missingValues: Record<string, number>;
  ageDistribution: Record<string, number>;
  genderDistribution: Record<string, number>;
  locationDistribution: Record<string, number>;
  educationDistribution: Record<string, number>;
  ethnicityDistribution: Record<string, number>;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  biasMetrics: BiasMetrics;
}

export interface BiasMetrics {
  genderBias: number;
  ageBias: number;
  locationBias: number;
  educationBias: number;
  ethnicityBias: number;
}

export interface TrainingOptions {
  modelType: 'randomForest' | 'gradientBoosting' | 'neuralNetwork' | 'lstm' | 'transformer';
  trainTestSplit: number;
  featureEngineering: {
    oneHotEncoding: boolean;
    ageBinning: boolean;
    geographicClustering: boolean;
    culturalMarkers: boolean;
  };
  hyperparameters: Record<string, number | string | boolean>;
}