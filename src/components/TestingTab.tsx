import React from 'react';
import { RMASearchTool } from './RMASearchTool';
import { TestingForm } from './TestingForm';
import { RMARecord, TestResult, Product } from '../types';
import { Clipboard, Sparkles, Download, CheckCircle } from 'lucide-react';

interface TestingTabProps {
  rmaData: RMARecord[];
  products: Product[];
  selectedRMA: RMARecord | null;
  onRMASelect: (rma: RMARecord) => void;
  onSubmitResult: (result: TestResult) => void;
}

export function TestingTab({ rmaData, products, selectedRMA, onRMASelect, onSubmitResult }: TestingTabProps) {
  const downloadProcessedCSV = () => {
    if (rmaData.length === 0) {
      alert('No RMA data available to download.');
      return;
    }

    const headers = [
      'RMA Number',
      'Customer Name', 
      'Product Name',
      'Issue Description',
      'Date Received',
      'Status',
      'Original Status',
      'Ordered From',
      'Date Ordered',
      'Customer Phone',
      'Order Number',
      'Invoice',
      'Invoice Link',
      'Replacement Address'
    ];

    const csvContent = [
      headers.join(','),
      ...rmaData.map(rma => [
        `"${rma.rmaNumber}"`,
        `"${rma.customerName}"`,
        `"${rma.productName}"`,
        `"${rma.issueDescription}"`,
        `"${rma.dateReceived}"`,
        `"${rma.status}"`,
        `"${rma.originalStatus || ''}"`,
        `"${rma.orderedFrom || ''}"`,
        `"${rma.dateOrdered || ''}"`,
        `"${rma.customerPhone || ''}"`,
        `"${rma.orderNumber || ''}"`,
        `"${rma.invoice || ''}"`,
        `"${rma.invoiceLink || ''}"`,
        `"${rma.replacementAddress || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `processed-rma-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {rmaData.length > 0 && (
        <div className="glass-effect border border-green-200/50 rounded-2xl p-6 shadow-elegant">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">CSV Data Loaded</h3>
                <p className="text-sm text-gray-600">
                  {rmaData.length} RMA records available for testing
                </p>
              </div>
            </div>

            <button
              onClick={downloadProcessedCSV}
              className="inline-flex items-center space-x-2 px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg transition-smooth font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Download CSV Data</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <RMASearchTool
            rmaData={rmaData}
            onRMASelect={onRMASelect}
          />
        </div>
        
        <div>
          {selectedRMA ? (
            <TestingForm 
              selectedRMA={selectedRMA} 
              products={products} 
              onSubmit={onSubmitResult}
            />
          ) : (
            <div className="glass-effect rounded-2xl border-2 border-dashed border-purple-200 p-12 text-center">
              <div className="relative">
                <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl mb-6">
                  <Clipboard className="w-16 h-16 mx-auto text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Select an RMA to Begin Testing</h3>
                <p className="text-gray-600 text-lg">Search for an RMA number on the left to view details and start the testing process</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}