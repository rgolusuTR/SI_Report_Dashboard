import * as XLSX from 'xlsx';
import { ReportData } from '../types';

export const exportToExcel = (data: ReportData[], filename: string = 'siteimprove-report.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report Data');
  
  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, 15)
  }));
  ws['!cols'] = colWidths;
  
  XLSX.writeFile(wb, filename);
};

export const exportDashboardToExcel = (
  filteredData: ReportData[],
  summaryStats: any,
  filename: string = 'dashboard-export.xlsx'
) => {
  const wb = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Dashboard Summary'],
    [''],
    ['Total Records', filteredData.length],
    ['Export Date', new Date().toLocaleDateString()],
    [''],
    ...Object.entries(summaryStats).map(([key, value]) => [key, value])
  ];
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  
  // Data sheet
  if (filteredData.length > 0) {
    const dataWs = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, dataWs, 'Data');
  }
  
  XLSX.writeFile(wb, filename);
};