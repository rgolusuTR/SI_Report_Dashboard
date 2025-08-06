import React from 'react';
import { BarChart3, Upload, Database } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'upload';
  onViewChange: (view: 'dashboard' | 'upload') => void;
  totalRecords: number;
  totalFiles: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  totalRecords,
  totalFiles
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Siteimprove Analytics</h1>
                <p className="text-sm text-gray-500">
                  {totalFiles} files • {totalRecords.toLocaleString()} records
                </p>
              </div>
            </div>
          </div>

          <nav className="flex space-x-4">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Database className="h-5 w-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => onViewChange('upload')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};