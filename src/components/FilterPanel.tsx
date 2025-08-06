import React from 'react';
import { Filter, Calendar, Search } from 'lucide-react';
import { FilterState } from '../types';
import { WEBSITES, REPORT_TYPES, DATE_RANGES } from '../constants';
import { format, subDays } from 'date-fns';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalRecords: number;
  filteredRecords: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  totalRecords,
  filteredRecords
}) => {
  const handleWebsiteChange = (websiteId: string, checked: boolean) => {
    const newWebsites = checked
      ? [...filters.websites, websiteId]
      : filters.websites.filter(id => id !== websiteId);
    
    onFiltersChange({ ...filters, websites: newWebsites });
  };

  const handleDateRangePreset = (days: number) => {
    if (days === 0) return; // Custom range
    
    const end = new Date();
    const start = subDays(end, days);
    
    onFiltersChange({
      ...filters,
      dateRange: {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-blue-600" />
        Filters
      </h3>
      
      {/* Results Summary */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-blue-600">{filteredRecords}</span> of{' '}
          <span className="font-semibold">{totalRecords}</span> records
        </p>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Search className="h-4 w-4 inline mr-1" />
          Search
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          placeholder="Search words, pages, or any content..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {/* Report Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Report Type
        </label>
        <select
          value={filters.reportType}
          onChange={(e) => onFiltersChange({ ...filters, reportType: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Reports</option>
          {REPORT_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Websites */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Websites
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {WEBSITES.map(website => (
            <label key={website.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.websites.includes(website.id)}
                onChange={(e) => handleWebsiteChange(website.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{website.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Date Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Date Range
        </label>
        
        <div className="space-y-2 mb-3">
          {DATE_RANGES.map(range => (
            <button
              key={range.value}
              onClick={() => handleDateRangePreset(range.value)}
              className={`w-full text-left p-2 rounded text-sm transition-colors ${
                range.value === 0 
                  ? 'text-gray-500' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              disabled={range.value === 0}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFiltersChange({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Clear Filters */}
      <button
        onClick={() => onFiltersChange({
          websites: [],
          reportType: '',
          dateRange: {
            start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            end: format(new Date(), 'yyyy-MM-dd')
          },
          searchTerm: ''
        })}
        className="w-full p-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};