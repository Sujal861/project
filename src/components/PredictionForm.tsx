import React, { useState } from 'react';
import { Brain, User, UserCheck } from 'lucide-react';
import { predictName } from '../ml/api';
import type { Demographic, PredictionResult } from '../types';

const PredictionForm: React.FC = () => {
  const [demographic, setDemographic] = useState<Demographic>({
    age: 35,
    gender: 'male',
    location: 'Northeast',
    educationLevel: 'bachelors',
    ethnicity: 'White'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemographic(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await predictName(demographic);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make prediction');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return 'text-green-600';
    if (confidence > 0.4) return 'text-amber-600';
    return 'text-red-600';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Name Prediction</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min="18"
                max="100"
                value={demographic.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
              <select
                id="gender"
                name="gender"
                value={demographic.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
              <select
                id="location"
                name="location"
                value={demographic.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="Northeast">Northeast</option>
                <option value="Midwest">Midwest</option>
                <option value="South">South</option>
                <option value="West">West</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="educationLevel" className="block text-sm font-medium mb-1">Education Level</label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={demographic.educationLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="high-school">High School</option>
                <option value="some-college">Some College</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="ethnicity" className="block text-sm font-medium mb-1">Ethnicity</label>
              <select
                id="ethnicity"
                name="ethnicity"
                value={demographic.ethnicity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Hispanic">Hispanic</option>
                <option value="Asian">Asian</option>
                <option value="Middle Eastern">Middle Eastern</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium mt-4 flex items-center justify-center ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Brain size={18} className="mr-2 animate-pulse" />
                  Predicting...
                </>
              ) : (
                <>
                  <Brain size={18} className="mr-2" />
                  Predict Name
                </>
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
        
        <div>
          {results ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <UserCheck size={20} className="mr-2" />
                  Prediction Results
                </h3>
                <p className="text-sm text-blue-600 mb-1">
                  Processed in {results.metadata.processingTime.toFixed(2)}ms using {results.metadata.modelUsed}
                </p>
                <p className="text-sm text-blue-600">
                  Overall Confidence: {(results.metadata.confidence * 100).toFixed(1)}%
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Top Name Predictions</h4>
                <div className="space-y-3">
                  {results.names.map((prediction) => (
                    <div
                      key={prediction.name}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          <User size={16} />
                        </div>
                        <span className="font-medium">{prediction.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`font-bold ${getConfidenceColor(prediction.confidence)}`}>
                          {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                        <span className="text-xs text-gray-500">Rank #{prediction.rank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Data Quality</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {(results.metadata.dataQuality * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{ width: `${results.metadata.dataQuality * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {results.metadata.dataQuality > 0.8
                    ? 'High quality data with good demographic representation.'
                    : results.metadata.dataQuality > 0.6
                    ? 'Moderate data quality. Some demographic groups may be underrepresented.'
                    : 'Low data quality. Results may be less reliable for this demographic profile.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-6 border border-dashed border-gray-300 rounded-md bg-gray-50 max-w-md mx-auto">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Predictions Yet</h3>
                <p className="text-gray-500">
                  Fill out the demographic information and click "Predict Name" to get name predictions based on the provided data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;