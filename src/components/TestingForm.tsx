import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Send, AlertTriangle, Package } from 'lucide-react';
import { RMARecord, TestResult, Product } from '../types';

interface TestingFormProps {
  selectedRMA: RMARecord;
  products: Product[];
  onSubmit: (result: TestResult) => void;
}

export function TestingForm({ selectedRMA, products, onSubmit }: TestingFormProps) {
  const [testingStatus, setTestingStatus] = useState<'More testing needed' | 'Replacement' | 'No issues found' | 'Physical Damage'>('More testing needed');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [additionalComments, setAdditionalComments] = useState('');

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.skuId.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedProductData = products.find(p => p.id === selectedProduct);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      alert('Please select a product.');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      alert('Selected product not found.');
      return;
    }

    const result: TestResult = {
      id: crypto.randomUUID(),
      rmaNumber: selectedRMA.rmaNumber,
      customerName: selectedRMA.customerName,
      orderNumber: selectedRMA.orderNumber || '',
      invoice: selectedRMA.invoice || '',
      customerPhone: selectedRMA.customerPhone || '',
      productSkuId: product.skuId,
      testingStatus,
      dateTested: new Date().toLocaleDateString('en-US'),
      issueDescription: selectedRMA.issueDescription,
      dateOrdered: selectedRMA.dateOrdered || '',
      additionalComments,
      invoiceLink: selectedRMA.invoiceLink || '',
      replacementAddress: selectedRMA.replacementAddress || ''
    };

    onSubmit(result);
    
    setTestingStatus('More testing needed');
    setSelectedProduct('');
    setProductSearch('');
    setShowProductDropdown(false);
    setAdditionalComments('');
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product.id);
    setProductSearch(`${product.name} (SKU: ${product.skuId})`);
    setShowProductDropdown(false);
  };

  const statusOptions = [
    { value: 'More testing needed', icon: Clock, color: 'yellow' },
    { value: 'Replacement', icon: XCircle, color: 'red' },
    { value: 'No issues found', icon: CheckCircle, color: 'green' },
    { value: 'Physical Damage', icon: AlertTriangle, color: 'orange' }
  ] as const;

  return (
    <div className="glass-effect rounded-2xl shadow-elegant border border-purple-100/50 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 gradient-bg rounded-xl">
          <Send className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Testing Form</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4">
            Select Product *
          </label>
          <div className="relative" onBlur={() => setTimeout(() => setShowProductDropdown(false), 200)}>
            <Package className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowProductDropdown(true);
                if (e.target.value === '') {
                  setSelectedProduct('');
                }
              }}
              onFocus={() => setShowProductDropdown(true)}
              placeholder="Search products by name or SKU..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-smooth text-lg font-medium bg-white"
              required
            />
            
            {showProductDropdown && productSearch && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-gray-50 border-b text-sm text-gray-600">
                      {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                    </div>
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-smooth"
                      >
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600 font-mono">SKU: {product.skuId}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No products found matching "{productSearch}"</p>
                  </div>
                )}
              </div>
            )}
            
            {selectedProductData && !showProductDropdown && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-900">Selected: {selectedProductData.name}</p>
                <p className="text-xs text-purple-700 font-mono">SKU: {selectedProductData.skuId}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-6">
            Test Result *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = testingStatus === option.value;
              
              return (
                <label
                  key={option.value}
                  className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-smooth group ${
                    isSelected
                      ? option.color === 'yellow' ? 'border-yellow-400 bg-yellow-50 shadow-lg' :
                        option.color === 'red' ? 'border-red-400 bg-red-50 shadow-lg' :
                        option.color === 'green' ? 'border-green-400 bg-green-50 shadow-lg' :
                        'border-orange-400 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30 hover:shadow-md'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={isSelected}
                    onChange={(e) => setTestingStatus(e.target.value as any)}
                    className="sr-only"
                  />
                  <div className={`p-3 rounded-xl mr-4 ${
                    isSelected
                      ? option.color === 'yellow' ? 'bg-yellow-100' :
                        option.color === 'red' ? 'bg-red-100' :
                        option.color === 'green' ? 'bg-green-100' :
                        'bg-orange-100'
                      : 'bg-gray-100 group-hover:bg-purple-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isSelected
                        ? option.color === 'yellow' ? 'text-yellow-600' :
                          option.color === 'red' ? 'text-red-600' :
                          option.color === 'green' ? 'text-green-600' :
                          'text-orange-600'
                        : 'text-gray-500 group-hover:text-purple-600'
                    }`} />
                  </div>
                  <span className={`font-semibold text-lg ${
                    isSelected
                      ? option.color === 'yellow' ? 'text-yellow-900' :
                        option.color === 'red' ? 'text-red-900' :
                        option.color === 'green' ? 'text-green-900' :
                        'text-orange-900'
                      : 'text-gray-700 group-hover:text-purple-900'
                  }`}>
                    {option.value}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Any additional comments?
          </label>
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            placeholder="Enter any additional comments about the testing..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-smooth resize-none"
          />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-smooth font-bold text-lg flex items-center justify-center space-x-3 group gradient-bg text-white hover:shadow-xl"
          >
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Submit Test Results</span>
          </button>
        </div>
      </form>
    </div>
  );
}