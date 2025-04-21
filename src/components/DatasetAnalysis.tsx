import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { getDatasetStats } from '../ml/api';
import type { DatasetStats } from '../types';

const DatasetAnalysis: React.FC = () => {
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'distributions' | 'quality' | 'summary'>('distributions');
  
  const COLORS = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = getDatasetStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dataset statistics');
      }
    };
    
    fetchStats();
  }, []);
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <FileSpreadsheet size={24} className="mx-auto mb-2 text-gray-400" />
        <p>Loading dataset statistics...</p>
      </div>
    );
  }
  
  // Transform data for charts
  const prepareChartData = (distribution: Record<string, number>) => {
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };
  
  const ageData = prepareChartData(stats.ageDistribution);
  const genderData = prepareChartData(stats.genderDistribution);
  const locationData = prepareChartData(stats.locationDistribution);
  const educationData = prepareChartData(stats.educationDistribution);
  const ethnicityData = prepareChartData(stats.ethnicityDistribution);
  
  const missingValuesData = Object.entries(stats.missingValues)
    .map(([field, count]) => ({ name: field, value: count }))
    .filter(item => item.value > 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dataset Analysis</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Database size={16} className="mr-1" />
          <span>{stats.totalRecords} records, {stats.uniqueNames} unique names</span>
        </div>
      </div>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'distributions' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('distributions')}
        >
          Distributions
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'quality' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('quality')}
        >
          Data Quality
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'summary' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
      </div>
      
      {activeTab === 'distributions' && (
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Age Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Gender Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Location Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Education Level Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={educationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Ethnicity Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ethnicityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Missing Values</h3>
            {missingValuesData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={missingValuesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                No missing values detected in the dataset.
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Data Quality Metrics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium">Data Completeness</p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: '98%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                  <p className="text-green-700 font-medium">98%</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium">Data Consistency</p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: '92%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                  <p className="text-green-700 font-medium">92%</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium">Demographic Balance</p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: '78%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                    ></div>
                  </div>
                  <p className="text-amber-700 font-medium">78%</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium">Data Accuracy</p>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: '85%' }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                  <p className="text-green-700 font-medium">85%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Data Bias Assessment</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="mb-4">
                The following biases have been identified in the dataset:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2"></span>
                  <span>Under-representation of certain ethnic groups (Middle Eastern, Other)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2"></span>
                  <span>Age imbalance with fewer samples for 65+ age group</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                  <span>Good gender balance across most categories</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-2"></span>
                  <span>Education levels skewed toward higher education</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-md">
            <h3 className="font-semibold text-lg mb-3">Dataset Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-xl font-bold">{stats.totalRecords}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Unique Names</p>
                <p className="text-xl font-bold">{stats.uniqueNames}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name Diversity Ratio</p>
                <p className="text-xl font-bold">{(stats.uniqueNames / stats.totalRecords * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Common Age Group</p>
                <p className="text-xl font-bold">25-34</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Common Ethnicity</p>
                <p className="text-xl font-bold">White</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Common Education</p>
                <p className="text-xl font-bold">Bachelor's</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-md">
            <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <p>Name diversity varies significantly by geographic region, with higher diversity in urban areas.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <p>Strong correlation between education level and name length observed in dataset.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <p>Age-based naming patterns show clear generational trends, with distinctive naming patterns for each decade.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <p>Ethnic naming patterns remain strong indicators, but are becoming more diverse over generations.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-md">
            <h3 className="font-semibold text-lg mb-3">Recommendations</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-bold text-sm">→</span>
                </div>
                <p>Increase sampling for underrepresented demographics (65+ age group, certain ethnicities).</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-bold text-sm">→</span>
                </div>
                <p>Add more regional granularity beyond the four major US regions for improved geographic analysis.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                  <span className="text-purple-600 font-bold text-sm">→</span>
                </div>
                <p>Include additional historical context for generational naming trends analysis.</p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetAnalysis;