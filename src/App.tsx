import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { ExcelUploader } from './components/ExcelUploader';
import { TestingTab } from './components/TestingTab';
import { ResultsTab } from './components/ResultsTab';
import { Dashboard } from './components/Dashboard';
import { RMARecord, TestResult, Product } from './types';
import { PRODUCTS } from './data/products';
import { ApiService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState<'testing' | 'results' | 'dashboard'>('testing');
  const [rmaData, setRmaData] = useState<RMARecord[]>([]);
  const [products] = useState<Product[]>(PRODUCTS);
  const [selectedRMA, setSelectedRMA] = useState<RMARecord | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Load data from backend on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Testing API connection...');
        const status = await ApiService.getSystemStatus();
        console.log('API Status:', status);
        
        const [rmaRecords, testResults] = await Promise.all([
          ApiService.getRMARecords(),
          ApiService.getTestResults()
        ]);
        
        setRmaData(rmaRecords);
        setTestResults(testResults);
        console.log(`Loaded ${rmaRecords.length} RMA records and ${testResults.length} test results from backend`);
      } catch (error) {
        console.error('Error loading data from backend:', error);
        console.error('API Base URL:', import.meta.env.VITE_API_BASE_URL);
        // No localStorage fallback - all data must come from database
        console.log('Backend connection failed. All data will be loaded from database only.');
        alert('Cannot connect to database. Please check your internet connection.');
      }
    };
    
    loadData();
  }, []);

  // No localStorage backup - all data stored in database only

  const handleDataLoaded = async (data: RMARecord[], filename: string, stats: { totalRows: number; validRMAs: number }) => {
    console.log('handleDataLoaded called with:', { dataLength: data.length, filename, stats });
    
    try {
      console.log('Attempting to upload to backend...');
      const result = await ApiService.uploadCSVData(data, filename, stats);
      console.log('Backend upload successful:', result);
      
      setRmaData(data);
      setSelectedRMA(null);
      console.log(`Uploaded ${data.length} RMA records from ${filename} to backend`);
    } catch (error) {
      console.error('Error uploading to backend:', error);
      alert(`Backend upload failed: ${error}. Data loaded locally only.`);
      
      // Fallback to local storage
      setRmaData(data);
      setSelectedRMA(null);
      console.log(`Loaded ${data.length} RMA records from ${filename} (local only)`);
    }
  };

  const handleSubmitResult = async (result: TestResult) => {
    console.log('Submitting test result:', result);
    
    try {
      console.log('Attempting to submit to backend...');
      const response = await ApiService.submitTestResult(result);
      console.log('Backend submission successful:', response);
      
      // Refresh test results from backend to ensure sync
      const updatedResults = await ApiService.getTestResults();
      setTestResults(updatedResults);
      
      alert(`Test result submitted successfully to database for ${result.rmaNumber}`);
      setActiveTab('results');
      setSelectedRMA(null);
    } catch (error) {
      console.error('Error submitting test result to backend:', error);
      alert(`Failed to submit to database: ${error}. Please check your connection and try again.`);
      
      // Don't fall back to localStorage - force user to fix the connection
      // This ensures all data goes to the shared database
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {rmaData.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <ExcelUploader onDataLoaded={handleDataLoaded} hasData={false} />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="mb-8">
                  <ExcelUploader onDataLoaded={handleDataLoaded} hasData={true} />
                </div>
              )}
              
              {activeTab === 'dashboard' ? (
                <Dashboard testResults={testResults} rmaData={rmaData} />
              ) : activeTab === 'testing' ? (
                <TestingTab
                  rmaData={rmaData}
                  products={products}
                  selectedRMA={selectedRMA}
                  onRMASelect={setSelectedRMA}
                  onSubmitResult={handleSubmitResult}
                />
              ) : (
                <ResultsTab testResults={testResults} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;