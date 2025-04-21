import type { NamePrediction } from '../../types';

/**
 * A simplified Random Forest classifier implementation for name prediction
 */
export class RandomForestClassifier {
  private trees: DecisionTree[];
  private numTrees: number;
  private maxDepth: number;
  private uniqueLabels: Set<string>;
  
  constructor(numTrees = 10, maxDepth = 5) {
    this.trees = [];
    this.numTrees = numTrees;
    this.maxDepth = maxDepth;
    this.uniqueLabels = new Set();
  }
  
  /**
   * Trains the random forest model on the provided data
   */
  train(data: any[]): void {
    // Extract all unique labels
    data.forEach(item => this.uniqueLabels.add(item.label));
    
    // Build multiple decision trees
    for (let i = 0; i < this.numTrees; i++) {
      // Bootstrap sampling (random sampling with replacement)
      const bootstrapSample = this.bootstrapSampling(data);
      
      // Create and train a decision tree
      const tree = new DecisionTree(this.maxDepth);
      tree.train(bootstrapSample);
      
      // Add the tree to the forest
      this.trees.push(tree);
    }
  }
  
  /**
   * Makes predictions for a single input
   */
  predict(features: any): NamePrediction[] {
    // Collect votes from all trees
    const votes: Record<string, number> = {};
    
    for (const tree of this.trees) {
      const prediction = tree.predict(features);
      votes[prediction] = (votes[prediction] || 0) + 1;
    }
    
    // Convert votes to an array and sort by count
    const predictions = Object.entries(votes)
      .map(([name, count]) => ({
        name,
        confidence: count / this.numTrees,
        rank: 0 // Will be updated below
      }))
      .sort((a, b) => b.confidence - a.confidence);
    
    // Assign ranks (1-based)
    predictions.forEach((pred, index) => {
      pred.rank = index + 1;
    });
    
    // Return top predictions
    return predictions.slice(0, 3);
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
   * Creates a bootstrap sample from the data
   */
  private bootstrapSampling(data: any[]): any[] {
    const sample = [];
    const n = data.length;
    
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * n);
      sample.push(data[randomIndex]);
    }
    
    return sample;
  }
}

/**
 * A simplified Decision Tree implementation
 */
class DecisionTree {
  private maxDepth: number;
  private root: any = null;
  
  constructor(maxDepth = 5) {
    this.maxDepth = maxDepth;
  }
  
  /**
   * Trains the decision tree on the provided data
   */
  train(data: any[]): void {
    const features = Object.keys(data[0].features);
    this.root = this.buildTree(data, features, 0);
  }
  
  /**
   * Recursively builds the decision tree
   */
  private buildTree(data: any[], features: string[], depth: number): any {
    // Base cases
    if (depth >= this.maxDepth || data.length === 0 || features.length === 0) {
      return this.createLeaf(data);
    }
    
    const uniqueLabels = new Set(data.map(item => item.label));
    if (uniqueLabels.size === 1) {
      return {
        type: 'leaf',
        prediction: data[0].label
      };
    }
    
    // Find the best feature to split on
    const bestFeature = this.findBestFeature(data, features);
    
    // Create a decision node
    const node = {
      type: 'node',
      feature: bestFeature,
      threshold: 0.5, // For simplicity in this demo, threshold at 0.5 for binary features
      left: null,
      right: null
    };
    
    // Split the data
    const leftData = data.filter(item => item.features[bestFeature] <= 0.5);
    const rightData = data.filter(item => item.features[bestFeature] > 0.5);
    
    // Remove the used feature (for simplicity)
    const remainingFeatures = features.filter(f => f !== bestFeature);
    
    // Recursively build the left and right subtrees
    node.left = this.buildTree(leftData, remainingFeatures, depth + 1);
    node.right = this.buildTree(rightData, remainingFeatures, depth + 1);
    
    return node;
  }
  
  /**
   * Creates a leaf node with the most common label
   */
  private createLeaf(data: any[]): any {
    if (data.length === 0) {
      return {
        type: 'leaf',
        prediction: 'unknown' // Default prediction
      };
    }
    
    // Count label occurrences
    const labelCounts: Record<string, number> = {};
    for (const item of data) {
      labelCounts[item.label] = (labelCounts[item.label] || 0) + 1;
    }
    
    // Find the most common label
    let maxCount = 0;
    let mostCommonLabel = '';
    
    for (const [label, count] of Object.entries(labelCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonLabel = label;
      }
    }
    
    return {
      type: 'leaf',
      prediction: mostCommonLabel
    };
  }
  
  /**
   * Finds the best feature to split on (simplified)
   */
  private findBestFeature(data: any[], features: string[]): string {
    // For simplicity, randomly select a feature (in a real implementation, would use information gain)
    const randomIndex = Math.floor(Math.random() * features.length);
    return features[randomIndex];
  }
  
  /**
   * Makes predictions for a single input
   */
  predict(features: any): string {
    let node = this.root;
    
    while (node.type !== 'leaf') {
      if (features[node.feature] <= node.threshold) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    
    return node.prediction;
  }
}