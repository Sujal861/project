import type { NamePrediction } from '../../types';

/**
 * A simplified Neural Network implementation for name prediction
 */
export class NeuralNetwork {
  private inputSize: number;
  private hiddenSize: number;
  private outputSize: number;
  private weights1: number[][];
  private weights2: number[][];
  private bias1: number[];
  private bias2: number[];
  private learningRate: number;
  private labels: string[];
  
  constructor(inputSize: number, hiddenSize = 10, learningRate = 0.1) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = 0; // Will be set during training
    this.weights1 = [];
    this.weights2 = [];
    this.bias1 = [];
    this.bias2 = [];
    this.learningRate = learningRate;
    this.labels = [];
  }
  
  /**
   * Trains the neural network on the provided data
   */
  train(data: any[], epochs = 100): void {
    if (data.length === 0) return;
    
    // Extract unique labels and set output size
    this.labels = [...new Set(data.map(item => item.label))];
    this.outputSize = this.labels.length;
    
    // Initialize weights and biases with random values
    this.initializeParameters();
    
    // Training loop
    for (let epoch = 0; epoch < epochs; epoch++) {
      // Shuffle data for each epoch
      const shuffledData = [...data].sort(() => Math.random() - 0.5);
      
      for (const item of shuffledData) {
        // Forward pass
        const { input, hidden, output } = this.forwardPass(this.extractFeatureVector(item.features));
        
        // Calculate target output (one-hot encoding)
        const target = this.oneHotEncode(item.label);
        
        // Backward pass (simplified backpropagation)
        // Output layer error
        const outputError = output.map((val, i) => val - target[i]);
        
        // Hidden layer error
        const hiddenError = new Array(this.hiddenSize).fill(0);
        for (let i = 0; i < this.hiddenSize; i++) {
          for (let j = 0; j < this.outputSize; j++) {
            hiddenError[i] += outputError[j] * this.weights2[i][j];
          }
          hiddenError[i] *= hidden[i] * (1 - hidden[i]); // Derivative of sigmoid
        }
        
        // Update weights and biases
        // Output layer weights
        for (let i = 0; i < this.hiddenSize; i++) {
          for (let j = 0; j < this.outputSize; j++) {
            this.weights2[i][j] -= this.learningRate * outputError[j] * hidden[i];
          }
        }
        
        // Output layer bias
        for (let j = 0; j < this.outputSize; j++) {
          this.bias2[j] -= this.learningRate * outputError[j];
        }
        
        // Hidden layer weights
        for (let i = 0; i < this.inputSize; i++) {
          for (let j = 0; j < this.hiddenSize; j++) {
            this.weights1[i][j] -= this.learningRate * hiddenError[j] * input[i];
          }
        }
        
        // Hidden layer bias
        for (let j = 0; j < this.hiddenSize; j++) {
          this.bias1[j] -= this.learningRate * hiddenError[j];
        }
      }
    }
  }
  
  /**
   * Makes predictions for a single input
   */
  predict(features: any): NamePrediction[] {
    const featureVector = this.extractFeatureVector(features);
    const { output } = this.forwardPass(featureVector);
    
    // Convert output probabilities to name predictions
    const predictions = output.map((prob, index) => ({
      name: this.labels[index],
      confidence: prob,
      rank: 0 // Will be updated below
    }));
    
    // Sort by confidence
    const sortedPredictions = predictions.sort((a, b) => b.confidence - a.confidence);
    
    // Assign ranks
    sortedPredictions.forEach((pred, index) => {
      pred.rank = index + 1;
    });
    
    // Return top predictions
    return sortedPredictions.slice(0, 3);
  }
  
  /**
   * Evaluates the model on test data
   */
  evaluate(testData: any[]): { accuracy: number } {
    let correct = 0;
    
    for (const item of testData) {
      const predictions = this.predict(item.features);
      if (predictions[0].name === item.label) {
        correct++;
      }
    }
    
    return {
      accuracy: correct / testData.length
    };
  }
  
  /**
   * Initializes network parameters
   */
  private initializeParameters(): void {
    // Initialize weights with random values between -0.5 and 0.5
    this.weights1 = Array(this.inputSize).fill(0).map(() => 
      Array(this.hiddenSize).fill(0).map(() => Math.random() - 0.5)
    );
    
    this.weights2 = Array(this.hiddenSize).fill(0).map(() => 
      Array(this.outputSize).fill(0).map(() => Math.random() - 0.5)
    );
    
    // Initialize biases with zeros
    this.bias1 = Array(this.hiddenSize).fill(0);
    this.bias2 = Array(this.outputSize).fill(0);
  }
  
  /**
   * Performs a forward pass through the network
   */
  private forwardPass(input: number[]): { input: number[], hidden: number[], output: number[] } {
    // Hidden layer
    const hidden = new Array(this.hiddenSize).fill(0);
    
    for (let j = 0; j < this.hiddenSize; j++) {
      let sum = this.bias1[j];
      for (let i = 0; i < this.inputSize; i++) {
        sum += input[i] * this.weights1[i][j];
      }
      hidden[j] = this.sigmoid(sum);
    }
    
    // Output layer
    const output = new Array(this.outputSize).fill(0);
    
    for (let j = 0; j < this.outputSize; j++) {
      let sum = this.bias2[j];
      for (let i = 0; i < this.hiddenSize; i++) {
        sum += hidden[i] * this.weights2[i][j];
      }
      output[j] = this.sigmoid(sum);
    }
    
    // Normalize output (softmax)
    const expSum = output.reduce((sum, val) => sum + Math.exp(val), 0);
    const normalizedOutput = output.map(val => Math.exp(val) / expSum);
    
    return { input, hidden, output: normalizedOutput };
  }
  
  /**
   * Sigmoid activation function
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
  
  /**
   * One-hot encodes a label
   */
  private oneHotEncode(label: string): number[] {
    const encoded = new Array(this.outputSize).fill(0);
    const index = this.labels.indexOf(label);
    if (index !== -1) {
      encoded[index] = 1;
    }
    return encoded;
  }
  
  /**
   * Extracts a feature vector from a features object
   */
  private extractFeatureVector(features: any): number[] {
    // Convert features object to array in a consistent order
    return Object.values(features) as number[];
  }
}