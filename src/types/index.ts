export interface Website {
  id: string;
  name: string;
  domain: string;
}

export interface ReportType {
  id: string;
  name: string;
  columns: string[];
}

export interface MisspellingReport {
  id: string;
  word: string;
  spellingSuggestion: string;
  language: string;
  firstDetected: string;
  pages: number;
  website: string;
  reportDate: string;
}

export interface WordToReviewReport {
  id: string;
  word: string;
  spellingSuggestion: string;
  language: string;
  firstDetected: string;
  misspellingProbability: number;
  pages: number;
  website: string;
  reportDate: string;
}

export interface PageWithMisspellingReport {
  id: string;
  title: string;
  url: string;
  pageReportLink: string;
  cmsLink: string;
  misspellings: number;
  wordsToReview: number;
  pageLevel: string;
  website: string;
  reportDate: string;
}

export interface MisspellingHistoryReport {
  id: string;
  reportDate: string;
  misspellings: number;
  wordsToReview: number;
  website: string;
}

export type ReportData = MisspellingReport | WordToReviewReport | PageWithMisspellingReport | MisspellingHistoryReport;

export interface FilterState {
  websites: string[];
  reportType: string;
  dateRange: {
    start: string;
    end: string;
  };
  searchTerm: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  website: string;
  reportType: string;
  uploadDate: string;
  rowCount: number;
}