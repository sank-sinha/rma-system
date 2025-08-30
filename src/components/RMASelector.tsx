import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { RMARecord } from '../types';

interface RMASelectorProps {
  rmaData: RMARecord[];
  selectedRMA: RMARecord | null;
  onRMASelect: (rma: RMARecord) => void;
}

export function RMASelector({ rmaData, selectedRMA, onRMASelect }: RMASelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRMAData = rmaData.filter(rma =>
    rma.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rma.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rma.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select RMA for Testing</h2>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by RMA number, customer, or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredRMAData.map((rma) => (
          <div
            key={rma.rmaNumber}
            onClick={() => onRMASelect(rma)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRMA?.rmaNumber === rma.rmaNumber
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-semibold text-blue-600">
                    {rma.rmaNumber}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    rma.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    rma.status === 'In Testing' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rma.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{rma.customerName} • {rma.productName}</p>
                <p className="text-xs text-gray-500">Received: {rma.dateReceived}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRMAData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>No RMA records found matching your search.</p>
        </div>
      )}
    </div>
  );
}