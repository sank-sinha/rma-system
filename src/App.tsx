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
        const [rmaRecords, testResults] = await Promise.all([
          ApiService.getRMARecords(),
          ApiService.getTestResults()
        ]);
        
        setRmaData(rmaRecords);
        setTestResults(testResults);
        console.log(`Loaded ${rmaRecords.length} RMA records and ${testResults.length} test results from backend`);
      } catch (error) {
        console.error('Error loading data from backend:', error);
        // Fallback to localStorage if backend is not available
        const savedRMAData = localStorage.getItem('rmaData');
        const savedTestResults = localStorage.getItem('testResults');
        
        if (savedRMAData) {
          try {
            const parsedRMAData = JSON.parse(savedRMAData);
            setRmaData(parsedRMAData);
          } catch (error) {
            console.error('Error parsing saved RMA data:', error);
          }
        }
        
        if (savedTestResults) {
          try {
            const parsedTestResults = JSON.parse(savedTestResults);
            setTestResults(parsedTestResults);
          } catch (error) {
            console.error('Error parsing saved test results:', error);
          }
        }
      }
    };
    
    loadData();
  }, []);

  // Keep localStorage as backup
  useEffect(() => {
    if (rmaData.length > 0) {
      localStorage.setItem('rmaData', JSON.stringify(rmaData));
    }
  }, [rmaData]);

  useEffect(() => {
    if (testResults.length > 0) {
      localStorage.setItem('testResults', JSON.stringify(testResults));
    }
  }, [testResults]);

  const handleDataLoaded = async (data: RMARecord[], filename: string, stats: { totalRows: number; validRMAs: number }) => {
    try {
      await ApiService.uploadCSVData(data, filename, stats);
      setRmaData(data);
      setSelectedRMA(null);
      console.log(`Uploaded ${data.length} RMA records from ${filename} to backend`);
    } catch (error) {
      console.error('Error uploading to backend:', error);
      // Fallback to local storage
      setRmaData(data);
      setSelectedRMA(null);
      console.log(`Loaded ${data.length} RMA records from ${filename} (local only)`);
    }
  };

  const handleSubmitResult = async (result: TestResult) => {
    try {
      await ApiService.submitTestResult(result);
      setTestResults(prev => [...prev, result]);
      alert(`Test result submitted successfully for ${result.rmaNumber}`);
      setActiveTab('results');
      setSelectedRMA(null);
    } catch (error) {
      console.error('Error submitting test result:', error);
      // Fallback to local storage
      setTestResults(prev => [...prev, result]);
      alert(`Test result submitted locally for ${result.rmaNumber} (backend unavailable)`);
      setActiveTab('results');
      setSelectedRMA(null);
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