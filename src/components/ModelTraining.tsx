import React, { useState } from 'react';
import { trainModels } from '../ml/api';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import type { TrainingOptions, ModelMetrics } from '../types';

const ModelTraining: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<TrainingOptions>({
    modelType: 'randomForest',
    trainTestSplit: 0.8,
    featureEngineering: {
      oneHotEncoding: true,
      ageBinning: true,
      geographicClustering: false,
      culturalMarkers: false
    },
    hyperparameters: {
      numTrees: 20,
      maxDepth: 5,
      learningRate: 0.1
    }
  });
  
  const handleOptionChange = (key: keyof TrainingOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleFeatureEngineeringChange = (key: keyof TrainingOptions['featureEngineering'], value: boolean) => {
    setOptions(prev => ({
      ...prev,
      featureEngineering: {
        ...prev.featureEngineering,
        [key]: value
      }
    }));
  };
  
  const handleHyperparameterChange = (key: string, value: number | string | boolean) => {
    setOptions(prev => ({
      ...prev,
      hyperparameters: {
        ...prev.hyperparameters,
        [key]: value
      }
    }));
  };
  
  const trainModel = async () => {
    setIsTraining(true);
    setError(null);
    
    try {
      const results = await trainModels(options);
      setMetrics(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during training');
    } finally {
      setIsTraining(false);
    }
  };
  
  const displayHyperparameters = () => {
    switch (options.modelType) {
      case 'randomForest':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Number of Trees</label>
              <input
                type="number"
                min="1"
                max="100"
                value={options.hyperparameters.numTrees || 20}
                onChange={(e) => handleHyperparameterChange('numTrees', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Max Depth</label>
              <input
                type="number"
                min="1"
                max="20"
                value={options.hyperparameters.maxDepth || 5}
                onChange={(e) => handleHyperparameterChange('maxDepth', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </>
        );
      case 'gradientBoosting':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Number of Trees</label>
              <input
                type="number"
                min="1"
                max="100"
                value={options.hyperparameters.numTrees || 15}
                onChange={(e) => handleHyperparameterChange('numTrees', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Learning Rate</label>
              <input
                type="number"
                min="0.01"
                max="1"
                step="0.01"
                value={options.hyperparameters.learningRate || 0.1}
                onChange={(e) => handleHyperparameterChange('learningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </>
        );
      case 'neuralNetwork':
      case 'lstm':
      case 'transformer':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Hidden Layers</label>
              <input
                type="number"
                min="1"
                max="5"
                value={options.hyperparameters.hiddenLayers || 2}
                onChange={(e) => handleHyperparameterChange('hiddenLayers', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Neurons per Layer</label>
              <input
                type="number"
                min="5"
                max="100"
                value={options.hyperparameters.neuronsPerLayer || 20}
                onChange={(e) => handleHyperparameterChange('neuronsPerLayer', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Learning Rate</label>
              <input
                type="number"
                min="0.001"
                max="0.5"
                step="0.001"
                value={options.hyperparameters.learningRate || 0.05}
                onChange={(e) => handleHyperparameterChange('learningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Epochs</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={options.hyperparameters.epochs || 200}
                onChange={(e) => handleHyperparameterChange('epochs', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Model Training</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Training Options</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Model Type</label>
            <select
              value={options.modelType}
              onChange={(e) => handleOptionChange('modelType', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={isTraining}
            >
              <option value="randomForest">Random Forest</option>
              <option value="gradientBoosting">Gradient Boosting</option>
              <option value="neuralNetwork">Neural Network</option>
              <option value="lstm">LSTM (Sequence Model)</option>
              <option value="transformer">Transformer</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Train/Test Split</label>
            <div className="flex items-center">
              <input
                type="range"
                min="0.5"
                max="0.9"
                step="0.05"
                value={options.trainTestSplit}
                onChange={(e) => handleOptionChange('trainTestSplit', parseFloat(e.target.value))}
                className="w-full mr-3"
                disabled={isTraining}
              />
              <span className="text-sm">{Math.round(options.trainTestSplit * 100)}%</span>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Feature Engineering</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="oneHotEncoding"
                  checked={options.featureEngineering.oneHotEncoding}
                  onChange={(e) => handleFeatureEngineeringChange('oneHotEncoding', e.target.checked)}
                  className="mr-2"
                  disabled={isTraining}
                />
                <label htmlFor="oneHotEncoding" className="text-sm">One-hot Encoding</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ageBinning"
                  checked={options.featureEngineering.ageBinning}
                  onChange={(e) => handleFeatureEngineeringChange('ageBinning', e.target.checked)}
                  className="mr-2"
                  disabled={isTraining}
                />
                <label htmlFor="ageBinning" className="text-sm">Age Binning</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="geographicClustering"
                  checked={options.featureEngineering.geographicClustering}
                  onChange={(e) => handleFeatureEngineeringChange('geographicClustering', e.target.checked)}
                  className="mr-2"
                  disabled={isTraining}
                />
                <label htmlFor="geographicClustering" className="text-sm">Geographic Clustering</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="culturalMarkers"
                  checked={options.featureEngineering.culturalMarkers}
                  onChange={(e) => handleFeatureEngineeringChange('culturalMarkers', e.target.checked)}
                  className="mr-2"
                  disabled={isTraining}
                />
                <label htmlFor="culturalMarkers" className="text-sm">Cultural/Ethnic Markers</label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3 text-gray-700">Hyperparameters</h4>
            {displayHyperparameters()}
          </div>
          
          <button
            onClick={trainModel}
            disabled={isTraining}
            className={`w-full py-2 px-4 rounded-md text-white font-medium mt-4 flex items-center justify-center ${
              isTraining ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isTraining ? (
              <>
                <Clock size={18} className="mr-2 animate-spin" />
                Training Model...
              </>
            ) : (
              'Train Model'
            )}
          </button>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Model Performance</h3>
          
          {!metrics ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-500">
              <p>Train a model to see performance metrics</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                <CheckCircle2 className="text-green-600 mr-2" size={20} />
                <span className="text-green-800">
                  Model trained successfully with {(metrics.accuracy * 100).toFixed(2)}% accuracy
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium">Accuracy</p>
                  <p className="text-lg font-bold">{(metrics.accuracy * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium">Precision</p>
                  <p className="text-lg font-bold">{(metrics.precision * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium">Recall</p>
                  <p className="text-lg font-bold">{(metrics.recall * 100).toFixed(2)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium">F1 Score</p>
                  <p className="text-lg font-bold">{(metrics.f1Score * 100).toFixed(2)}%</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Bias Analysis</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.biasMetrics).map(([key, value]) => {
                    const biasLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    const biasLevel = value < 0.1 ? 'Low' : value < 0.2 ? 'Moderate' : 'High';
                    const biasColor = value < 0.1 ? 'text-green-600' : value < 0.2 ? 'text-amber-600' : 'text-red-600';
                    
                    return (
                      <div key={key} className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded">
                        <span>{biasLabel}</span>
                        <span className={`font-medium ${biasColor}`}>{biasLevel} ({(value * 100).toFixed(1)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;