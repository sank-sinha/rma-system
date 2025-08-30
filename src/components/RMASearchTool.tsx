import React, { useState } from 'react';
import { Search, AlertTriangle, Calendar, User, Package, Phone, MapPin, CreditCard, FileText } from 'lucide-react';
import { RMARecord } from '../types';

interface RMASearchToolProps {
  rmaData: RMARecord[];
  onRMASelect: (rma: RMARecord) => void;
}

export function RMASearchTool({ rmaData, onRMASelect }: RMASearchToolProps) {
  const [searchRMA, setSearchRMA] = useState('');
  const [foundRMA, setFoundRMA] = useState<RMARecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!searchRMA.trim()) return;
    
    const searchTerm = searchRMA.trim();
    
    const found = rmaData.find(rma => {
      return rma.rmaNumber.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    if (found) {
      setFoundRMA(found);
      setNotFound(false);
      onRMASelect(found);
    } else {
      setFoundRMA(null);
      setNotFound(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-elegant border border-purple-100/50 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 gradient-bg rounded-xl">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Search RMA Details</h2>
      </div>
      
      <div className="flex space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Enter RMA number to search..."
            value={searchRMA}
            onChange={(e) => {
              setSearchRMA(e.target.value);
              setNotFound(false);
              setFoundRMA(null);
            }}
            onKeyPress={handleKeyPress}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-smooth text-lg font-medium"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-8 py-4 gradient-bg text-white rounded-xl hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-smooth font-semibold"
        >
          Search
        </button>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">RMA Not Found</h4>
              <p className="text-sm text-red-600">No RMA record found matching "{searchRMA}"</p>
            </div>
          </div>
        </div>
      )}

      {foundRMA && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">RMA Details Found</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              foundRMA.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              foundRMA.status === 'In Testing' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {foundRMA.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-xl p-4">
                <label className="text-sm font-semibold text-purple-700 mb-2 block">RMA Number</label>
                <p className="font-mono font-bold text-purple-900 text-xl">{foundRMA.rmaNumber}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                    <p className="text-gray-900 font-medium">{foundRMA.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Package className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Product Name</label>
                    <p className="text-gray-900 font-medium">{foundRMA.productName}</p>
                  </div>
                </div>

                {foundRMA.orderedFrom && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Ordered From</label>
                      <p className="text-gray-900 font-medium">{foundRMA.orderedFrom}</p>
                    </div>
                  </div>
                )}

                {foundRMA.dateOrdered && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Date Ordered</label>
                      <p className="text-gray-900 font-medium">{foundRMA.dateOrdered}</p>
                    </div>
                  </div>
                )}

                {foundRMA.customerPhone && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Customer Phone</label>
                      <p className="text-gray-900 font-mono font-medium">{foundRMA.customerPhone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="text-lg font-bold text-red-900">Issue Description</h4>
                </div>
                <div className="bg-white border border-red-200 rounded-xl p-6">
                  <p className="text-red-900 leading-relaxed font-medium text-base">
                    {foundRMA.issueDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}