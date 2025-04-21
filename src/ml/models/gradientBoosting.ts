import type { NamePrediction } from '../../types';

/**
 * A simplified Gradient Boosting classifier implementation for name prediction
 */
export class GradientBoostingClassifier {
  private trees: SimpleRegressor[];
  private numTrees: number;
  private learningRate: number;
  private uniqueLabels: string[];
  private labelMapping: Map<string, number>;
  
  constructor(numTrees = 10, learningRate = 0.1) {
    this.trees = [];
    this.numTrees = numTrees;
    this.learningRate = learningRate;
    this.uniqueLabels = [];
    this.labelMapping = new Map();
  }
  
  /**
   * Trains the gradient boosting model on the provided data
   */
  train(data: any[]): void {
    // Extract and map unique labels to numeric values
    this.uniqueLabels = [...new Set(data.map(item => item.label))];
    this.uniqueLabels.forEach((label, index) => {
      this.labelMapping.set(label, index);
    });
    
    // Convert labels to numeric values for regression
    const numericData = data.map(item => ({
      features: item.features,
      label: this.labelMapping.get(item.label) || 0
    }));
    
    // Initialize predictions with zeros
    const predictions = new Array(numericData.length).fill(0);
    
    // Train the ensemble of trees
    for (let i = 0; i < this.numTrees; i++) {
      // Calculate residuals (errors)
      const residuals = numericData.map((item, index) => 
        item.label - this.sigmoid(predictions[index])
      );
      
      // Train a regression tree on the residuals
      const tree = new SimpleRegressor();
      tree.train(numericData.map((item, index) => ({
        features: item.features,
        label: residuals[index]
      })));
      
      // Update predictions
      numericData.forEach((item, index) => {
        predictions[index] += this.learningRate * tree.predict(item.features);
      });
      
      // Add the tree to the ensemble
      this.trees.push(tree);
    }
  }
  
  /**
   * Makes predictions for a single input
   */
  predict(features: any): NamePrediction[] {
    // Get raw predictions from all trees
    let rawPrediction = 0;
    
    for (const tree of this.trees) {
      rawPrediction += this.learningRate * tree.predict(features);
    }
    
    // Convert to probability using sigmoid
    const probability = this.sigmoid(rawPrediction);
    
    // Calculate probabilities for each class (simplified for demo)
    const classProbabilities = this.uniqueLabels.map((label, index) => {
      // In a real multi-class implementation, this would be more complex
      // Here we're simplifying by using distance from the predicted value
      const distance = Math.abs(index - (probability * this.uniqueLabels.length));
      const scaledProb = 1 / (1 + distance);
      
      return {
        name: label,
        confidence: scaledProb,
        rank: 0 // Will be updated below
      };
    });
    
    // Sort by confidence
    const sortedPredictions = classProbabilities.sort((a, b) => b.confidence - a.confidence);
    
    // Normalize confidences to sum to 1
    const sum = sortedPredictions.reduce((acc, pred) => acc + pred.confidence, 0);
    sortedPredictions.forEach(pred => {
      pred.confidence = pred.confidence / sum;
    });
    
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
   * Sigmoid activation function
   */
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
}

/**
 * A simplified regression tree implementation
 */
class SimpleRegressor {
  private tree: any = null;
  
  /**
   * Trains the regression tree on the provided data
   */
  train(data: any[]): void {
    const features = Object.keys(data[0].features);
    this.tree = this.buildTree(data, features, 0, 3); // Max depth of 3 for simplicity
  }
  
  /**
   * Recursively builds the regression tree
   */
  private buildTree(data: any[], features: string[], depth: number, maxDepth: number): any {
    // Base cases
    if (depth >= maxDepth || data.length <= 5 || features.length === 0) { // Minimum samples per leaf = 5
      return {
        type: 'leaf',
        value: this.calculateAverage(data)
      };
    }
    
    // Find the best feature and split point
    const { feature, threshold } = this.findBestSplit(data, features);
    
    // Split the data
    const leftData = data.filter(item => item.features[feature] <= threshold);
    const rightData = data.filter(item => item.features[feature] > threshold);
    
    // Check if the split is useful
    if (leftData.length === 0 || rightData.length === 0) {
      return {
        type: 'leaf',
        value: this.calculateAverage(data)
      };
    }
    
    // Create a decision node
    return {
      type: 'node',
      feature,
      threshold,
      left: this.buildTree(leftData, features, depth + 1, maxDepth),
      right: this.buildTree(rightData, features, depth + 1, maxDepth)
    };
  }
  
  /**
   * Calculates the average label value
   */
  private calculateAverage(data: any[]): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.label, 0);
    return sum / data.length;
  }
  
  /**
   * Finds the best feature and threshold for splitting (simplified)
   */
  private findBestSplit(data: any[], features: string[]): { feature: string, threshold: number } {
    // For simplicity, randomly select a feature
    const feature = features[Math.floor(Math.random() * features.length)];
    
    // For binary features, use 0.5 as threshold
    // For continuous features, use median
    const values = data.map(item => item.features[feature]);
    const threshold = 0.5; // Simplified for demo
    
    return { feature, threshold };
  }
  
  /**
   * Makes predictions for a single input
   */
  predict(features: any): number {
    let node = this.tree;
    
    while (node.type !== 'leaf') {
      if (features[node.feature] <= node.threshold) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    
    return node.value;
  }
}