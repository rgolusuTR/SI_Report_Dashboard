# Siteimprove Analytics Dashboard

A modern, interactive dashboard application for visualizing and analyzing Siteimprove analytics data, focusing on spelling issues across multiple websites.

## Features

- **Interactive Dashboard**: View comprehensive analytics with summary cards, charts, and data tables
- **File Upload**: Support for CSV and Excel file formats from Siteimprove reports
- **Advanced Filtering**: Search, filter by website, report type, and date ranges
- **Data Visualization**: Charts showing trends over time and distribution by website/report type
- **Export Functionality**: Export filtered data for further analysis
- **Responsive Design**: Works on desktop and mobile devices

## Live Demo

🚀 **[View Live Dashboard](https://rgolusutr.github.io/SI_Report_Dashboard/)**

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **File Processing**: PapaParser (CSV), xlsx (Excel)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages with GitHub Actions

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rgolusuTR/SI_Report_Dashboard.git
cd SI_Report_Dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/SI_Report_Dashboard/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Usage

1. **Upload Data**: Click the "Upload" button to upload Siteimprove CSV or Excel reports
2. **View Dashboard**: Navigate to the dashboard to see analytics and visualizations
3. **Filter Data**: Use the search and filter options to analyze specific data
4. **Export Results**: Export filtered data for further analysis

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
