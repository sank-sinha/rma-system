import React from 'react';
import { Package, ClipboardCheck, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'testing' | 'results' | 'dashboard';
  onTabChange: (tab: 'testing' | 'results' | 'dashboard') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-primary via-secondary-medium to-secondary-dark shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <img 
                src="/Primary Inverse(1).png" 
                alt="Company Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RMA Testing System</h1>
              <p className="text-white/80 text-sm">Customer Returns Management</p>
            </div>
          </div>
          
          <nav className="flex space-x-2">
            <button
              onClick={() => onTabChange('testing')}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'testing'
                  ? 'bg-white text-primary shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>RMA Testing</span>
            </button>
            
            <button
              onClick={() => onTabChange('results')}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'results'
                  ? 'bg-white text-primary shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              <ClipboardCheck className="w-5 h-5" />
              <span>Test Results</span>
            </button>
            
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-primary shadow-lg transform scale-105'
                  : 'text-white/80 hover:text-white hover:bg-white/10 hover:scale-105'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}