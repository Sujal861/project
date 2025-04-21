import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart2, RefreshCcw } from 'lucide-react';

const PerformanceMetrics: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  // Sample data for demonstration
  const accuracyTrends = [
    { name: 'Day 1', randomForest: 0.78, gradientBoosting: 0.76, neuralNetwork: 0.72 },
    { name: 'Day 2', randomForest: 0.79, gradientBoosting: 0.77, neuralNetwork: 0.74 },
    { name: 'Day 3', randomForest: 0.81, gradientBoosting: 0.79, neuralNetwork: 0.75 },
    { name: 'Day 4', randomForest: 0.82, gradientBoosting: 0.80, neuralNetwork: 0.77 },
    { name: 'Day 5', randomForest: 0.83, gradientBoosting: 0.82, neuralNetwork: 0.79 },
    { name: 'Day 6', randomForest: 0.84, gradientBoosting: 0.83, neuralNetwork: 0.80 },
    { name: 'Day 7', randomForest: 0.85, gradientBoosting: 0.84, neuralNetwork: 0.82 },
  ];
  
  const processingTimeData = [
    { name: 'Random Forest', time: 42 },
    { name: 'Gradient Boosting', time: 68 },
    { name: 'Neural Network', time: 127 },
    { name: 'LSTM', time: 245 },
    { name: 'Transformer', time: 312 },
  ];
  
  const biasMetricsData = [
    { name: 'Gender Bias', randomForest: 0.12, gradientBoosting: 0.14, neuralNetwork: 0.18 },
    { name: 'Age Bias', randomForest: 0.15, gradientBoosting: 0.13, neuralNetwork: 0.16 },
    { name: 'Location Bias', randomForest: 0.09, gradientBoosting: 0.11, neuralNetwork: 0.13 },
    { name: 'Education Bias', randomForest: 0.07, gradientBoosting: 0.09, neuralNetwork: 0.11 },
    { name: 'Ethnicity Bias', randomForest: 0.16, gradientBoosting: 0.19, neuralNetwork: 0.22 },
  ];
  
  const modelDriftData = [
    { name: 'Week 1', drift: 0.02 },
    { name: 'Week 2', drift: 0.03 },
    { name: 'Week 3', drift: 0.04 },
    { name: 'Week 4', drift: 0.06 },
    { name: 'Week 5', drift: 0.08 },
    { name: 'Week 6', drift: 0.09 },
    { name: 'Week 7', drift: 0.11 },
    { name: 'Week 8', drift: 0.13 },
  ];
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Performance Metrics</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          <RefreshCcw size={16} className={`mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <BarChart2 size={18} className="mr-2 text-blue-600" />
            Model Accuracy Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={accuracyTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0.7, 0.9]} />
                <Tooltip 
                  formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Accuracy']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="randomForest" 
                  name="Random Forest" 
                  stroke="#2563EB" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="gradientBoosting" 
                  name="Gradient Boosting" 
                  stroke="#10B981" 
                />
                <Line 
                  type="monotone" 
                  dataKey="neuralNetwork" 
                  name="Neural Network" 
                  stroke="#8B5CF6" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3">Processing Time by Model Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processingTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}ms`, 'Processing Time']}
                />
                <Bar dataKey="time" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3">Bias Metrics by Model Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={biasMetricsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 0.25]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip 
                  formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Bias']}
                />
                <Legend />
                <Bar dataKey="randomForest" name="Random Forest" fill="#2563EB" />
                <Bar dataKey="gradientBoosting" name="Gradient Boosting" fill="#10B981" />
                <Bar dataKey="neuralNetwork" name="Neural Network" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3">Model Drift Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={modelDriftData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 0.15]} />
                <Tooltip 
                  formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Model Drift']}
                />
                <Line 
                  type="monotone" 
                  dataKey="drift" 
                  stroke="#EF4444" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <p className="text-sm text-blue-700 font-medium">Best Model Accuracy</p>
          <p className="text-2xl font-bold text-blue-800">85.1%</p>
          <p className="text-xs text-blue-600 mt-1">Random Forest</p>
        </div>
        <div className="bg-green-50 p-4 rounded-md border border-green-100">
          <p className="text-sm text-green-700 font-medium">Fastest Processing</p>
          <p className="text-2xl font-bold text-green-800">42ms</p>
          <p className="text-xs text-green-600 mt-1">Random Forest</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
          <p className="text-sm text-purple-700 font-medium">Lowest Bias Score</p>
          <p className="text-2xl font-bold text-purple-800">7.4%</p>
          <p className="text-xs text-purple-600 mt-1">Random Forest (Education)</p>
        </div>
        <div className="bg-red-50 p-4 rounded-md border border-red-100">
          <p className="text-sm text-red-700 font-medium">Current Model Drift</p>
          <p className="text-2xl font-bold text-red-800">13.2%</p>
          <p className="text-xs text-red-600 mt-1">Retraining recommended</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;