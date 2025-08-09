import React, { useState, useEffect } from "react";
import {
  BarChart,
  TrendingUp,
  FileText,
  AlertCircle,
  Settings,
} from "lucide-react";
import { FilterState, ReportData, Website } from "../types";
import { FilterPanel } from "./FilterPanel";
import { Charts } from "./Charts";
import { DataTable } from "./DataTable";
import { WebsiteManager } from "./WebsiteManager";
import { exportDashboardToExcel } from "../utils/exportUtils";
import { format, subDays } from "date-fns";

interface DashboardProps {
  data: ReportData[];
  websites: Website[];
  onDeleteRecord?: (recordId: string) => void;
  onDeleteMultipleRecords?: (recordIds: string[]) => void;
  onAddWebsite?: (website: Omit<Website, "id">) => void;
  onUpdateWebsite?: (id: string, website: Omit<Website, "id">) => void;
  onDeleteWebsite?: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  websites,
  onDeleteRecord,
  onDeleteMultipleRecords,
  onAddWebsite,
  onUpdateWebsite,
  onDeleteWebsite,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    websites: [],
    reportType: "",
    dateRange: {
      start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
      end: format(new Date(), "yyyy-MM-dd"),
    },
    searchTerm: "",
  });

  const filteredData = data.filter((item) => {
    // Website filter
    if (
      filters.websites.length > 0 &&
      !filters.websites.includes(item.website)
    ) {
      return false;
    }

    // Report type filter
    if (filters.reportType && !item.id.startsWith(filters.reportType)) {
      return false;
    }

    // Date range filter
    const itemDate = new Date(item.reportDate);
    const startDate = new Date(filters.dateRange.start);
    const endDate = new Date(filters.dateRange.end);

    if (itemDate < startDate || itemDate > endDate) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const searchableText = Object.values(item).join(" ").toLowerCase();

      if (!searchableText.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  // Calculate summary statistics
  const summaryStats = {
    "Total Misspellings": filteredData.filter(
      (item) =>
        item.id.startsWith("misspellings") ||
        item.id.startsWith("misspelling-history")
    ).length,
    "Words to Review": filteredData.filter((item) =>
      item.id.startsWith("words-to-review")
    ).length,
    "Pages with Issues": filteredData.filter((item) =>
      item.id.startsWith("pages-with-misspellings")
    ).length,
    "Unique Websites": new Set(filteredData.map((item) => item.website)).size,
  };

  const handleExport = () => {
    exportDashboardToExcel(
      filteredData,
      summaryStats,
      `siteimprove-dashboard-${format(new Date(), "yyyy-MM-dd")}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BarChart className="h-8 w-8 text-blue-600" />
              Siteimprove Reports Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and analyze spelling issues across your websites
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FileText className="h-5 w-5" />
            Export Dashboard
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(summaryStats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{key}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {value.toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                {key.includes("Misspellings") && (
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                )}
                {key.includes("Review") && (
                  <FileText className="h-6 w-6 text-blue-600" />
                )}
                {key.includes("Pages") && (
                  <BarChart className="h-6 w-6 text-blue-600" />
                )}
                {key.includes("Websites") && (
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            totalRecords={data.length}
            filteredRecords={filteredData.length}
            websites={websites}
          />

          {/* Website Management */}
          {onAddWebsite && onUpdateWebsite && onDeleteWebsite && (
            <WebsiteManager
              websites={websites}
              onAddWebsite={onAddWebsite}
              onUpdateWebsite={onUpdateWebsite}
              onDeleteWebsite={onDeleteWebsite}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Charts */}
          <Charts data={filteredData} />

          {/* Data Table */}
          <DataTable
            data={filteredData}
            onExport={handleExport}
            onRowClick={(item) => {
              console.log("Row clicked:", item);
              // Could implement a detail modal here
            }}
            onDeleteRecord={onDeleteRecord}
            onDeleteMultipleRecords={onDeleteMultipleRecords}
          />
        </div>
      </div>
    </div>
  );
};
