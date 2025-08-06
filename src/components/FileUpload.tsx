import React, { useCallback, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { WEBSITES, REPORT_TYPES } from '../constants';

interface FileUploadProps {
  onFileUpload: (file: File, website: string, reportType: string) => Promise<{ success: boolean; rowCount?: number; error?: string }>;
  loading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [selectedWebsite, selectedReportType]);

  const handleFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Website:', selectedWebsite, 'Report Type:', selectedReportType);
    
    if (!selectedWebsite || !selectedReportType) {
      setUploadStatus({ message: 'Please select website and report type first', type: 'error' });
      return;
    }

    // Validate file type
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus({ 
        message: 'Invalid file type. Please upload CSV or Excel files (.csv, .xlsx, .xls)', 
        type: 'error' 
      });
      return;
    }

    try {
      setUploadStatus(null);
      const result = await onFileUpload(file, selectedWebsite, selectedReportType);
      
      if (result.success) {
        setUploadStatus({ 
          message: `Successfully uploaded ${file.name} with ${result.rowCount} records`, 
          type: 'success' 
        });
        // Reset selections after successful upload
        setSelectedWebsite('');
        setSelectedReportType('');
      } else {
        setUploadStatus({ 
          message: result.error || 'Upload failed', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        message: 'An unexpected error occurred during upload', 
        type: 'error' 
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset the input value to allow re-uploading the same file
    e.target.value = '';
  };

  const canUpload = selectedWebsite && selectedReportType && !loading;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="h-6 w-6 text-blue-600" />
        Upload Siteimprove Report
      </h2>
      
      {uploadStatus && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{uploadStatus.message}</span>
          <button
            onClick={() => setUploadStatus(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website *
          </label>
          <select
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select website...</option>
            {WEBSITES.map(website => (
              <option key={website.id} value={website.id}>
                {website.name} ({website.domain})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type *
          </label>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select report type...</option>
            {REPORT_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : canUpload 
              ? 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              : 'border-gray-200 bg-gray-50'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={loading || !canUpload}
          id="file-upload"
        />
        
        <File className={`h-12 w-12 mx-auto mb-4 transition-colors ${
          canUpload ? 'text-blue-500' : 'text-gray-400'
        }`} />
        
        <div className="space-y-2">
          <p className={`text-lg font-medium transition-colors ${
            loading 
              ? 'text-gray-500' 
              : canUpload 
                ? 'text-gray-700' 
                : 'text-gray-500'
          }`}>
            {loading 
              ? 'Processing file...' 
              : canUpload
                ? 'Drop your file here or click to browse'
                : 'Please select website and report type first'
            }
          </p>
          <p className="text-sm text-gray-500">
            Supports CSV and Excel files (.csv, .xlsx, .xls)
          </p>
          <p className="text-xs text-gray-400">
            Data will be parsed starting from row 4 as per Siteimprove format
          </p>
          {!canUpload && !loading && (
            <p className="text-xs text-red-500 font-medium">
              Both website and report type must be selected to upload files
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Upload Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Select the website and report type before uploading</li>
          <li>• Ensure your file follows the Siteimprove format (data starts from row 4)</li>
          <li>• Supported formats: CSV (.csv), Excel (.xlsx, .xls)</li>
          <li>• Files will be automatically parsed and validated</li>
        </ul>
      </div>
    </div>
  );
};