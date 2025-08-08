import { useState, useCallback } from "react";
import { ReportData, UploadedFile, FilterState } from "../types";
import { processFile } from "../utils/fileParser";
import { generateDummyData, dummyUploadedFiles } from "../data/dummyData";

export const useReportData = () => {
  const [reportData, setReportData] = useState<ReportData[]>(
    generateDummyData()
  );
  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>(dummyUploadedFiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File, website: string, reportType: string) => {
      console.log("useReportData.uploadFile called:", {
        fileName: file.name,
        website,
        reportType,
      });
      setLoading(true);
      setError(null);

      try {
        console.log("Starting file processing...");
        const { data, metadata } = await processFile(file, reportType);

        console.log("File processed successfully:", {
          dataLength: data.length,
          metadata,
        });

        const uploadedFile: UploadedFile = {
          id: `file-${Date.now()}`,
          name: file.name,
          website,
          reportType,
          uploadDate: new Date().toISOString(),
          rowCount: data.length,
        };

        setReportData((prev) => [...prev, ...data]);
        setUploadedFiles((prev) => [...prev, uploadedFile]);

        console.log("Data and files updated successfully");
        return { success: true, rowCount: data.length };
      } catch (err) {
        console.error("Upload error:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        console.log("Upload process completed");
        setLoading(false);
      }
    },
    []
  );

  const filterData = useCallback(
    (filters: FilterState): ReportData[] => {
      return reportData.filter((item) => {
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
    },
    [reportData]
  );

  const deleteFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    // Also remove associated report data if needed
    // Note: This is a simple implementation. In a real app, you might want to track
    // which data belongs to which file for more precise deletion
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setReportData([]);
    setUploadedFiles([]);
    setError(null);
  }, []);

  return {
    reportData,
    uploadedFiles,
    loading,
    error,
    uploadFile,
    filterData,
    deleteFile,
    clearData,
  };
};
