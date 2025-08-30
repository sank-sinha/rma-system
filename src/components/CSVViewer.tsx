import React from 'react';
import { Eye, X } from 'lucide-react';

interface CSVViewerProps {
  csvData: string[][];
  headers: string[];
  onClose: () => void;
}

export function CSVViewer({ csvData, headers, onClose }: CSVViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">CSV Data Preview</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-auto max-h-[70vh]">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Headers ({headers.length} columns):</h4>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {headers.map((header, index) => (
                <div key={index} className="flex">
                  <span className="w-8 text-gray-500">#{index}:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">{header}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">First 5 rows of data:</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {headers.map((header, index) => (
                      <th key={index} className="border border-gray-300 px-2 py-1 text-xs font-medium text-left">
                        #{index}: {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {headers.map((_, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 px-2 py-1 text-xs">
                          {row[colIndex] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}