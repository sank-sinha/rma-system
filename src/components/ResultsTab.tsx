import React, { useState } from 'react';
import { Search, Calendar, FileText, CheckCircle, XCircle, Clock, AlertTriangle, Download, BarChart3, Filter, X } from 'lucide-react';
import { TestResult } from '../types';

interface ResultsTabProps {
  testResults: TestResult[];
}

export function ResultsTab({ testResults }: ResultsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    showFilters: false
  });

  const exportToCSV = () => {
    if (testResults.length === 0) {
      alert('No test results to export.');
      return;
    }

    const headers = [
      'Customer Name',
      'Order Number',
      'Invoice',
      'Customer Phone Number',
      'RMA Number',
      'Date Tested',
      'Product SKU ID',
      'Test Result',
      'Issue Description',
      'Date Ordered',
      'Invoice Link',
      'Replacement Address',
      'Additional Comments'
    ];

    const csvContent = [
      headers.join(','),
      ...testResults.map(result => [
        `"${result.customerName}"`,
        `"${result.orderNumber}"`,
        `"${result.invoice}"`,
        `"${result.customerPhone}"`,
        `"${result.rmaNumber}"`,
        `"${result.dateTested}"`,
        `"${result.productSkuId}"`,
        `"${result.testingStatus}"`,
        `"${result.issueDescription}"`,
        `"${result.dateOrdered}"`,
        `"${result.invoiceLink || ''}"`,
        `"${result.replacementAddress || ''}"`,
        `"${result.additionalComments || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `test-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = testResults.filter(result => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      result.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testingStatus.toLowerCase().includes(searchTerm.toLowerCase());

    // Date filter
    let matchesDate = true;
    if (dateFilter.startDate || dateFilter.endDate) {
      const resultDate = new Date(result.dateTested);
      
      if (dateFilter.startDate) {
        const startDate = new Date(dateFilter.startDate);
        matchesDate = matchesDate && resultDate >= startDate;
      }
      
      if (dateFilter.endDate) {
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        matchesDate = matchesDate && resultDate <= endDate;
      }
    }

    return matchesSearch && matchesDate;
  });

  const clearFilters = () => {
    setDateFilter({
      startDate: '',
      endDate: '',
      showFilters: false
    });
    setSearchTerm('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'More testing needed':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Replacement':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'No issues found':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Physical Damage':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'More testing needed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Replacement':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'No issues found':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Physical Damage':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-effect rounded-2xl shadow-elegant border border-purple-100/50">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 gradient-bg rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Test Results History</h2>
                <p className="text-gray-600">
                  {testResults.length} total result{testResults.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {testResults.length > 0 && (
              <button
                onClick={exportToCSV}
                className="inline-flex items-center space-x-3 px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg transition-smooth font-semibold"
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by RMA number, customer, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-smooth text-lg"
                />
              </div>
              
              <button
                onClick={() => setDateFilter(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                className={`flex items-center space-x-2 px-6 py-4 rounded-xl border transition-smooth font-semibold ${
                  dateFilter.showFilters || dateFilter.startDate || dateFilter.endDate
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Date Filter</span>
              </button>
              
              {(dateFilter.startDate || dateFilter.endDate || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-smooth"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            
            {dateFilter.showFilters && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-4">Filter by Test Date</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={dateFilter.startDate}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={dateFilter.endDate}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-smooth"
                    />
                  </div>
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                    <p className="text-sm text-purple-800">
                      Showing results from {dateFilter.startDate || 'beginning'} to {dateFilter.endDate || 'today'}
                      {filteredResults.length !== testResults.length && (
                        <span className="font-semibold"> ({filteredResults.length} of {testResults.length} results)</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          {filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="mb-4 px-8 py-4 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredResults.length}</span> of <span className="font-semibold text-gray-900">{testResults.length}</span> total results
                  {(dateFilter.startDate || dateFilter.endDate) && (
                    <span className="ml-2 text-purple-600">
                      (filtered by date: {dateFilter.startDate || 'start'} to {dateFilter.endDate || 'end'})
                    </span>
                  )}
                </p>
              </div>
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Customer Details
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Order Information
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Product & Dates
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Test Result
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Issue Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredResults.map((result, index) => (
                    <tr key={result.id} className={`hover:bg-purple-50/50 transition-smooth ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{result.customerName}</p>
                          <p className="text-sm text-gray-600 font-mono mt-1">{result.customerPhone}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900"><span className="font-medium">Order:</span> {result.orderNumber}</p>
                          <p className="text-sm text-gray-900"><span className="font-medium">Invoice:</span> {result.invoice}</p>
                          <p className="text-sm text-gray-600 font-mono"><span className="font-medium">RMA:</span> {result.rmaNumber}</p>
                          {result.invoiceLink && (
                            <p className="text-sm">
                              <a href={result.invoiceLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">
                                View Invoice
                              </a>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">SKU: {result.productSkuId}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-600">{result.dateTested}</p>
                          </div>
                          {result.dateOrdered && (
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-600">Ordered: {result.dateOrdered}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(result.testingStatus)}`}>
                          {getStatusIcon(result.testingStatus)}
                          <span>{result.testingStatus}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 leading-relaxed">{result.issueDescription}</p>
                          {result.replacementAddress && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm font-semibold text-blue-800 mb-2">📦 Replacement Address:</p>
                              <p className="text-sm text-blue-700 leading-relaxed whitespace-pre-wrap">{result.replacementAddress}</p>
                            </div>
                          )}
                          {result.additionalComments && (
                            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-sm font-semibold text-purple-800 mb-2">💬 Testing Comments:</p>
                              <p className="text-sm text-purple-700">{result.additionalComments}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl mb-6 inline-block">
                <FileText className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {testResults.length === 0 ? 'No test results yet' : 'No results match your filters'}
              </h3>
              <p className="text-gray-600 text-lg">
                {testResults.length === 0 
                  ? 'Test results will appear here after submissions.'
                  : 'Try adjusting your search or date filters.'
                }
              </p>
              {(searchTerm || dateFilter.startDate || dateFilter.endDate) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-smooth font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {testResults.length > 0 && (
        <div className="glass-effect rounded-2xl shadow-elegant border border-purple-100/50 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Storage Information</h3>
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Persistent Storage Active</h4>
            </div>
            <p className="text-green-800 mb-2">
              All test results are automatically saved to your browser's local storage.
            </p>
            <p className="text-sm text-green-700">
              Total stored results: <span className="font-semibold">{testResults.length}</span> • 
              Data will persist across browser sessions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}