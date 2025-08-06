import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { ReportData, MisspellingReport, WordToReviewReport, PageWithMisspellingReport, MisspellingHistoryReport } from '../types';

export const parseCSVFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    console.log('Parsing CSV file:', file.name);
    Papa.parse(file, {
      complete: (result) => {
        console.log('CSV parse complete:', result.data.length, 'rows');
        resolve(result.data as string[][]);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        reject(error);
      },
      skipEmptyLines: true
    });
  });
};

export const parseExcelFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    console.log('Parsing Excel file:', file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
        console.log('Excel parse complete:', jsonData.length, 'rows');
        resolve(jsonData);
      } catch (error) {
        console.error('Excel parse error:', error);
        reject(error);
      }
    };
    reader.onerror = () => {
      console.error('FileReader error');
      reject(new Error('Failed to read Excel file'));
    };
    reader.readAsArrayBuffer(file);
  });
};

export const extractReportMetadata = (data: string[][]): { reportDate: string; website: string } => {
  console.log('Extracting metadata from data:', data.slice(0, 3));
  // Extract metadata from first few rows
  const reportDate = data[0]?.[1] || new Date().toISOString().split('T')[0];
  const website = data[1]?.[1] || 'unknown';
  
  console.log('Extracted metadata:', { reportDate, website });
  return { reportDate, website };
};

export const parseReportData = (
  data: string[][],
  reportType: string,
  website: string,
  reportDate: string
): ReportData[] => {
  console.log('Parsing report data:', { reportType, website, reportDate, totalRows: data.length });
  // Skip first 3 rows (metadata and headers) and start from row 4 (index 3)
  const dataRows = data.slice(3).filter(row => row.some(cell => cell && cell.toString().trim()));
  
  console.log('Data rows after filtering:', dataRows.length);
  
  return dataRows.map((row, index) => {
    const id = `${reportType}-${website}-${Date.now()}-${index}`;
    
    switch (reportType) {
      case 'misspellings':
        return {
          id,
          word: row[0] || '',
          spellingSuggestion: row[1] || '',
          language: row[2] || '',
          firstDetected: row[3] || '',
          pages: parseInt(row[4]) || 0,
          website,
          reportDate
        } as MisspellingReport;
        
      case 'words-to-review':
        return {
          id,
          word: row[0] || '',
          spellingSuggestion: row[1] || '',
          language: row[2] || '',
          firstDetected: row[3] || '',
          misspellingProbability: parseFloat(row[4]) || 0,
          pages: parseInt(row[5]) || 0,
          website,
          reportDate
        } as WordToReviewReport;
        
      case 'pages-with-misspellings':
        return {
          id,
          title: row[0] || '',
          url: row[1] || '',
          pageReportLink: row[2] || '',
          cmsLink: row[3] || '',
          misspellings: parseInt(row[4]) || 0,
          wordsToReview: parseInt(row[5]) || 0,
          pageLevel: row[6] || '',
          website,
          reportDate
        } as PageWithMisspellingReport;
        
      case 'misspelling-history':
        return {
          id,
          reportDate: row[0] || reportDate,
          misspellings: parseInt(row[1]) || 0,
          wordsToReview: parseInt(row[2]) || 0,
          // Ignore total words column as specified
          website
        } as MisspellingHistoryReport;
        
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
  });
};

export const processFile = async (
  file: File,
  reportType: string
): Promise<{ data: ReportData[]; metadata: { reportDate: string; website: string } }> => {
  console.log('Processing file:', file.name, 'Type:', reportType);
  let rawData: string[][];
  
  if (file.name.endsWith('.csv')) {
    rawData = await parseCSVFile(file);
  } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    rawData = await parseExcelFile(file);
  } else {
    console.error('Unsupported file format:', file.name);
    throw new Error('Unsupported file format. Please upload CSV or Excel files.');
  }
  
  console.log('Raw data parsed, rows:', rawData.length);
  const metadata = extractReportMetadata(rawData);
  const data = parseReportData(rawData, reportType, metadata.website, metadata.reportDate);
  
  console.log('Final processed data:', data.length, 'records');
  return { data, metadata };
};