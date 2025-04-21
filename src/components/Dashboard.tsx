import React from 'react';
import { Brain, FileSpreadsheet, LineChart, Settings } from 'lucide-react';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-4 md:px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold flex items-center text-gray-800">
          <Brain className="mr-2 text-blue-600" />
          Name Prediction System
        </h1>
        <p className="text-gray-500 mt-1">
          Predict likely names from demographic data using machine learning
        </p>
      </div>
      
      <div className="px-4 md:px-6 py-3 bg-gray-50 border-b border-gray-200">
        <nav className="flex space-x-1 md:space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              activeTab === 'prediction'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Brain size={18} className="mr-2" />
            Name Prediction
          </button>
          
          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              activeTab === 'training'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={18} className="mr-2" />
            Model Training
          </button>
          
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              activeTab === 'dataset'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileSpreadsheet size={18} className="mr-2" />
            Dataset Analysis
          </button>
          
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
              activeTab === 'metrics'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LineChart size={18} className="mr-2" />
            Performance Metrics
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;