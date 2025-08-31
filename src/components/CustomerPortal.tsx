import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { RMARecord, TestResult } from '../types';

interface CustomerPortalProps {
  rmaData: RMARecord[];
  testResults: TestResult[];
}

export function CustomerPortal({ rmaData, testResults }: CustomerPortalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customerData, setCustomerData] = useState<RMARecord | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Search by RMA number, phone, or invoice
    const found = rmaData.find(record => 
      record.rmaNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.customerPhone.includes(searchQuery) ||
      record.invoice.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setCustomerData(found || null);

    if (found) {
      const result = testResults.find(r => r.rmaNumber === found.rmaNumber);
      setTestResult(result || null);
    } else {
      setTestResult(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getETA = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'more testing needed': return '2-3 business days';
      case 'replacement': return '5-7 business days';
      case 'no issues found': return 'Completed';
      case 'physical damage': return '3-5 business days';
      default: return '1-2 business days';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your RMA Request</h1>
          <p className="text-lg text-gray-600">Enter your RMA number, phone number, or invoice number to check status</p>
        </div>

        <div className="glass-effect rounded-2xl p-8 mb-8 shadow-elegant border border-blue-100/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter RMA number, phone, or invoice number..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-smooth text-lg"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 gradient-bg text-white rounded-xl hover:shadow-lg transition-smooth font-semibold text-lg"
            >
              Search
            </button>
          </div>
        </div>

        {customerData ? (
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-8 shadow-elegant border border-green-100/50">
              <div className="flex items-center space-x-3 mb-6">
                <Package className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Request Found</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {customerData.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {customerData.customerPhone}</p>
                    <p><span className="font-medium">RMA Number:</span> {customerData.rmaNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Product:</span> {customerData.productName}</p>
                    <p><span className="font-medium">Issue:</span> {customerData.issueDescription}</p>
                    <p><span className="font-medium">Date Ordered:</span> {customerData.dateOrdered}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8 shadow-elegant border border-blue-100/50">
              <div className="flex items-center space-x-3 mb-6">
                <Clock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Status & Timeline</h2>
              </div>

              {testResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Testing Status:</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(testResult.testingStatus)}`}>
                      {testResult.testingStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Estimated Resolution:</span>
                    </div>
                    <span className="text-blue-600 font-medium">
                      {getETA(testResult.testingStatus)}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border">
                    <div className="flex items-center space-x-3 mb-2">
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">Date Tested:</span>
                    </div>
                    <p className="text-gray-600">{testResult.dateTested}</p>
                  </div>

                  {testResult.additionalComments && (
                    <div className="p-4 bg-white rounded-xl border">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">Additional Comments:</span>
                      </div>
                      <p className="text-gray-600">{testResult.additionalComments}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing in Progress</h3>
                  <p className="text-gray-600">Your request is being processed. Estimated time: 1-2 business days</p>
                </div>
              )}
            </div>
          </div>
        ) : searchQuery && (
          <div className="glass-effect rounded-2xl p-8 text-center shadow-elegant border border-red-100/50">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Request Found</h3>
            <p className="text-gray-600">Please check your RMA number, phone number, or invoice number and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}