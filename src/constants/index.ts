import { Website, ReportType } from '../types';

export const WEBSITES: Website[] = [
  { id: 'tax', name: 'Tax Thomson Reuters', domain: 'tax.thomsonreuters.com' },
  { id: 'main', name: 'Thomson Reuters', domain: 'thomsonreuters.com' },
  { id: 'legal', name: 'Legal Thomson Reuters', domain: 'legal.thomsonreuters.com' },
  { id: 'writers', name: 'Thompson Writers', domain: 'thompsonwriters.co.ca' },
  { id: 'legal-uk', name: 'Legal UK Website', domain: 'legal-uk.thomsonreuters.com' }
];

export const REPORT_TYPES: ReportType[] = [
  {
    id: 'misspellings',
    name: 'Misspellings',
    columns: ['Word', 'Spelling Suggestion', 'Language', 'First Detected', 'Pages']
  },
  {
    id: 'words-to-review',
    name: 'Words to Review',
    columns: ['Word', 'Spelling Suggestion', 'Language', 'First Detected', 'Misspelling Probability', 'Pages']
  },
  {
    id: 'pages-with-misspellings',
    name: 'Pages with Misspellings',
    columns: ['Title', 'URL', 'Page Report Link', 'CMS Link', 'Misspellings', 'Words to Review', 'Page Level']
  },
  {
    id: 'misspelling-history',
    name: 'Misspelling History',
    columns: ['Report Date', 'Misspellings', 'Words to Review']
  }
];

export const DATE_RANGES = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 365 days', value: 365 },
  { label: 'Custom', value: 0 }
];

export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#14B8A6',
  accent: '#F97316',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899'
};