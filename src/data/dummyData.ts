import { ReportData, MisspellingReport, WordToReviewReport, PageWithMisspellingReport, MisspellingHistoryReport } from '../types';

// Generate dates for the last 90 days
const generateDates = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const websites = ['tax', 'main', 'legal', 'writers', 'legal-uk'];
const languages = ['en-US', 'en-CA', 'en-GB', 'fr-CA'];
const commonMisspellings = [
  { word: 'recieve', suggestion: 'receive' },
  { word: 'seperate', suggestion: 'separate' },
  { word: 'occured', suggestion: 'occurred' },
  { word: 'accomodate', suggestion: 'accommodate' },
  { word: 'definately', suggestion: 'definitely' },
  { word: 'neccessary', suggestion: 'necessary' },
  { word: 'begining', suggestion: 'beginning' },
  { word: 'existance', suggestion: 'existence' },
  { word: 'maintainance', suggestion: 'maintenance' },
  { word: 'independant', suggestion: 'independent' },
  { word: 'priviledge', suggestion: 'privilege' },
  { word: 'embarass', suggestion: 'embarrass' },
  { word: 'recomend', suggestion: 'recommend' },
  { word: 'beleive', suggestion: 'believe' },
  { word: 'acheive', suggestion: 'achieve' }
];

const wordsToReview = [
  { word: 'colour', suggestion: 'color' },
  { word: 'centre', suggestion: 'center' },
  { word: 'realise', suggestion: 'realize' },
  { word: 'analyse', suggestion: 'analyze' },
  { word: 'organisation', suggestion: 'organization' },
  { word: 'behaviour', suggestion: 'behavior' },
  { word: 'favour', suggestion: 'favor' },
  { word: 'honour', suggestion: 'honor' },
  { word: 'labour', suggestion: 'labor' },
  { word: 'neighbour', suggestion: 'neighbor' }
];

const samplePages = [
  { title: 'Tax Planning Guide 2024', url: '/tax/planning-guide-2024' },
  { title: 'Corporate Tax Updates', url: '/tax/corporate-updates' },
  { title: 'Legal Research Tools', url: '/legal/research-tools' },
  { title: 'Case Law Database', url: '/legal/case-law' },
  { title: 'About Thomson Reuters', url: '/about' },
  { title: 'Contact Us', url: '/contact' },
  { title: 'Privacy Policy', url: '/privacy' },
  { title: 'Terms of Service', url: '/terms' },
  { title: 'Writer Guidelines', url: '/writers/guidelines' },
  { title: 'Editorial Standards', url: '/writers/standards' }
];

const generateMisspellingReports = (): MisspellingReport[] => {
  const reports: MisspellingReport[] = [];
  const dates = generateDates(30);
  
  dates.forEach((date, dateIndex) => {
    websites.forEach((website) => {
      // Generate 3-8 misspelling reports per website per day
      const numReports = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < numReports; i++) {
        const misspelling = commonMisspellings[Math.floor(Math.random() * commonMisspellings.length)];
        const language = languages[Math.floor(Math.random() * languages.length)];
        
        // Generate first detected date (1-30 days before report date)
        const firstDetectedDate = new Date(date);
        firstDetectedDate.setDate(firstDetectedDate.getDate() - Math.floor(Math.random() * 30));
        
        reports.push({
          id: `misspellings-${website}-${date}-${i}`,
          word: misspelling.word,
          spellingSuggestion: misspelling.suggestion,
          language,
          firstDetected: firstDetectedDate.toISOString().split('T')[0],
          pages: Math.floor(Math.random() * 15) + 1,
          website,
          reportDate: date
        });
      }
    });
  });
  
  return reports;
};

const generateWordsToReviewReports = (): WordToReviewReport[] => {
  const reports: WordToReviewReport[] = [];
  const dates = generateDates(30);
  
  dates.forEach((date) => {
    websites.forEach((website) => {
      // Generate 2-5 words to review per website per day
      const numReports = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < numReports; i++) {
        const word = wordsToReview[Math.floor(Math.random() * wordsToReview.length)];
        const language = languages[Math.floor(Math.random() * languages.length)];
        
        const firstDetectedDate = new Date(date);
        firstDetectedDate.setDate(firstDetectedDate.getDate() - Math.floor(Math.random() * 20));
        
        reports.push({
          id: `words-to-review-${website}-${date}-${i}`,
          word: word.word,
          spellingSuggestion: word.suggestion,
          language,
          firstDetected: firstDetectedDate.toISOString().split('T')[0],
          misspellingProbability: Math.random() * 0.4 + 0.3, // 30-70% probability
          pages: Math.floor(Math.random() * 8) + 1,
          website,
          reportDate: date
        });
      }
    });
  });
  
  return reports;
};

const generatePagesWithMisspellingsReports = (): PageWithMisspellingReport[] => {
  const reports: PageWithMisspellingReport[] = [];
  const dates = generateDates(30);
  
  dates.forEach((date) => {
    websites.forEach((website) => {
      // Generate 1-4 pages with misspellings per website per day
      const numReports = Math.floor(Math.random() * 4) + 1;
      
      for (let i = 0; i < numReports; i++) {
        const page = samplePages[Math.floor(Math.random() * samplePages.length)];
        const misspellings = Math.floor(Math.random() * 12) + 1;
        const wordsToReview = Math.floor(Math.random() * 8) + 1;
        
        reports.push({
          id: `pages-with-misspellings-${website}-${date}-${i}`,
          title: page.title,
          url: page.url,
          pageReportLink: `https://my.siteimprove.com/page-report/${website}${page.url}`,
          cmsLink: `https://cms.${website}.com/edit${page.url}`,
          misspellings,
          wordsToReview,
          pageLevel: Math.floor(Math.random() * 4) + 1,
          website,
          reportDate: date
        });
      }
    });
  });
  
  return reports;
};

const generateMisspellingHistoryReports = (): MisspellingHistoryReport[] => {
  const reports: MisspellingHistoryReport[] = [];
  const dates = generateDates(90); // 3 months of history
  
  dates.forEach((date) => {
    websites.forEach((website) => {
      // Generate trending data with some realistic patterns
      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Lower activity on weekends
      const baseMultiplier = isWeekend ? 0.3 : 1;
      
      // Add some seasonal variation
      const dateObj = new Date(date);
      const dayOfYear = Math.floor((dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const seasonalMultiplier = 0.8 + 0.4 * Math.sin((dayOfYear / 365) * 2 * Math.PI);
      
      const misspellings = Math.floor((Math.random() * 25 + 15) * baseMultiplier * seasonalMultiplier);
      const wordsToReview = Math.floor((Math.random() * 15 + 8) * baseMultiplier * seasonalMultiplier);
      
      reports.push({
        id: `misspelling-history-${website}-${date}`,
        reportDate: date,
        misspellings,
        wordsToReview,
        website
      });
    });
  });
  
  return reports;
};

export const generateDummyData = (): ReportData[] => {
  const allReports: ReportData[] = [
    ...generateMisspellingReports(),
    ...generateWordsToReviewReports(),
    ...generatePagesWithMisspellingsReports(),
    ...generateMisspellingHistoryReports()
  ];
  
  return allReports;
};

export const dummyUploadedFiles = [
  {
    id: 'file-1',
    name: 'tax-misspellings-2024-01.csv',
    website: 'tax',
    reportType: 'misspellings',
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    rowCount: 156
  },
  {
    id: 'file-2',
    name: 'main-words-to-review-2024-01.xlsx',
    website: 'main',
    reportType: 'words-to-review',
    uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    rowCount: 89
  },
  {
    id: 'file-3',
    name: 'legal-pages-misspellings-2024-01.csv',
    website: 'legal',
    reportType: 'pages-with-misspellings',
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    rowCount: 67
  },
  {
    id: 'file-4',
    name: 'writers-history-2024-q1.xlsx',
    website: 'writers',
    reportType: 'misspelling-history',
    uploadDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    rowCount: 90
  },
  {
    id: 'file-5',
    name: 'legal-uk-misspellings-2024-01.csv',
    website: 'legal-uk',
    reportType: 'misspellings',
    uploadDate: new Date().toISOString(), // Today
    rowCount: 134
  }
];