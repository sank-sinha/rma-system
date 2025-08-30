import React from 'react';
import { AlertTriangle, Calendar, User } from 'lucide-react';
import { RMARecord } from '../types';

interface IssueHighlightProps {
  selectedRMA: RMARecord;
}

export function IssueHighlight({ selectedRMA }: IssueHighlightProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <span>Issue Details</span>
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">RMA Number</label>
            <p className="font-mono font-semibold text-blue-600">{selectedRMA.rmaNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              selectedRMA.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              selectedRMA.status === 'In Testing' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {selectedRMA.status}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>Customer Information</span>
          </label>
          <p className="text-gray-900">{selectedRMA.customerName}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Product</label>
          <p className="text-gray-900 font-medium">{selectedRMA.productName}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Date Received</span>
          </label>
          <p className="text-gray-900">{selectedRMA.dateReceived}</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <label className="text-sm font-medium text-orange-800 mb-2 block">
            Reported Issue
          </label>
          <p className="text-orange-900 leading-relaxed">{selectedRMA.issueDescription}</p>
        </div>
      </div>
    </div>
  );
}