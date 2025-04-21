import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import PredictionForm from './components/PredictionForm';
import ModelTraining from './components/ModelTraining';
import DatasetAnalysis from './components/DatasetAnalysis';
import PerformanceMetrics from './components/PerformanceMetrics';

function App() {
  const [activeTab, setActiveTab] = useState('prediction');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Name Prediction System</h1>
          <p className="text-sm opacity-80">Machine Learning for Demographic Analysis</p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {activeTab === 'prediction' && <PredictionForm />}
          {activeTab === 'training' && <ModelTraining />}
          {activeTab === 'dataset' && <DatasetAnalysis />}
          {activeTab === 'metrics' && <PerformanceMetrics />}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Name Prediction System &copy; 2025 | Privacy-First ML Analysis</p>
          <p className="mt-1 text-gray-400 text-xs">
            All data is processed locally and anonymized. No personal information is stored or shared.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;