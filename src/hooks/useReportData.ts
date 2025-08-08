import { useState, useCallback, useEffect } from "react";
import { ReportData, UploadedFile, FilterState } from "../types";
import { processFile } from "../utils/fileParser";
import { generateDummyData, dummyUploadedFiles } from "../data/dummyData";

const STORAGE_KEYS = {
  REPORT_DATA: "siteimprove_report_data",
  UPLOADED_FILES: "siteimprove_uploaded_files",
  DELETED_FILES: "siteimprove_deleted_files",
  DELETED_RECORDS: "siteimprove_deleted_records",
};

export const useReportData = () => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data from localStorage or dummy data
  useEffect(() => {
    const savedReportData = localStorage.getItem(STORAGE_KEYS.REPORT_DATA);
    const savedUploadedFiles = localStorage.getItem(
      STORAGE_KEYS.UPLOADED_FILES
    );
    const deletedFiles = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DELETED_FILES) || "[]"
    );
    const deletedRecords = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DELETED_RECORDS) || "[]"
    );

    if (savedReportData && savedUploadedFiles) {
      // Load from localStorage
      const parsedReportData = JSON.parse(savedReportData);
      const parsedUploadedFiles = JSON.parse(savedUploadedFiles);

      // Filter out deleted records and files
      const filteredReportData = parsedReportData.filter(
        (record: ReportData) => !deletedRecords.includes(record.id)
      );
      const filteredUploadedFiles = parsedUploadedFiles.filter(
        (file: UploadedFile) => !deletedFiles.includes(file.id)
      );

      setReportData(filteredReportData);
      setUploadedFiles(filteredUploadedFiles);
    } else {
      // Initialize with dummy data and save to localStorage
      const initialReportData = generateDummyData();
      const initialUploadedFiles = dummyUploadedFiles;

      // Filter out deleted items
      const filteredReportData = initialReportData.filter(
        (record) => !deletedRecords.includes(record.id)
      );
      const filteredUploadedFiles = initialUploadedFiles.filter(
        (file) => !deletedFiles.includes(file.id)
      );

      setReportData(filteredReportData);
      setUploadedFiles(filteredUploadedFiles);

      localStorage.setItem(
        STORAGE_KEYS.REPORT_DATA,
        JSON.stringify(initialReportData)
      );
      localStorage.setItem(
        STORAGE_KEYS.UPLOADED_FILES,
        JSON.stringify(initialUploadedFiles)
      );
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (reportData.length > 0 || uploadedFiles.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.REPORT_DATA,
        JSON.stringify(reportData)
      );
      localStorage.setItem(
        STORAGE_KEYS.UPLOADED_FILES,
        JSON.stringify(uploadedFiles)
      );
    }
  }, [reportData, uploadedFiles]);

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
    // Add to deleted files list in localStorage
    const deletedFiles = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DELETED_FILES) || "[]"
    );
    deletedFiles.push(fileId);
    localStorage.setItem(
      STORAGE_KEYS.DELETED_FILES,
      JSON.stringify(deletedFiles)
    );

    // Remove from current state
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    setError(null);
  }, []);

  const deleteRecord = useCallback((recordId: string) => {
    // Add to deleted records list in localStorage
    const deletedRecords = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DELETED_RECORDS) || "[]"
    );
    deletedRecords.push(recordId);
    localStorage.setItem(
      STORAGE_KEYS.DELETED_RECORDS,
      JSON.stringify(deletedRecords)
    );

    // Remove from current state
    setReportData((prev) => prev.filter((record) => record.id !== recordId));
    setError(null);
  }, []);

  const deleteMultipleRecords = useCallback((recordIds: string[]) => {
    // Add to deleted records list in localStorage
    const deletedRecords = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DELETED_RECORDS) || "[]"
    );
    const updatedDeletedRecords = [...deletedRecords, ...recordIds];
    localStorage.setItem(
      STORAGE_KEYS.DELETED_RECORDS,
      JSON.stringify(updatedDeletedRecords)
    );

    // Remove from current state
    setReportData((prev) =>
      prev.filter((record) => !recordIds.includes(record.id))
    );
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setReportData([]);
    setUploadedFiles([]);
    setError(null);
  }, []);

  const resetAllData = useCallback(() => {
    // Clear all localStorage data
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reset to initial dummy data
    const initialReportData = generateDummyData();
    const initialUploadedFiles = dummyUploadedFiles;

    setReportData(initialReportData);
    setUploadedFiles(initialUploadedFiles);

    localStorage.setItem(
      STORAGE_KEYS.REPORT_DATA,
      JSON.stringify(initialReportData)
    );
    localStorage.setItem(
      STORAGE_KEYS.UPLOADED_FILES,
      JSON.stringify(initialUploadedFiles)
    );

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
    deleteRecord,
    deleteMultipleRecords,
    clearData,
    resetAllData,
  };
};
