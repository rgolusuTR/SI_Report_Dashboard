import React, { useState } from "react";
import { Header } from "./components/Header";
import { FileUpload } from "./components/FileUpload";
import { Dashboard } from "./components/Dashboard";
import { useReportData } from "./hooks/useReportData";

function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "upload">(
    "dashboard"
  );
  const { reportData, uploadedFiles, loading, error, uploadFile, deleteFile } =
    useReportData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        totalRecords={reportData.length}
        totalFiles={uploadedFiles.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {currentView === "upload" && (
          <div className="space-y-6">
            <FileUpload onFileUpload={uploadFile} loading={loading} />

            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Uploaded Files ({uploadedFiles.length})
                  </h3>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete all ${uploadedFiles.length} files? This action cannot be undone.`
                        )
                      ) {
                        uploadedFiles.forEach((file) => deleteFile(file.id));
                      }
                    }}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    title="Delete all files"
                  >
                    🗑️ Delete All
                  </button>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          {file.website} • {file.reportType} • {file.rowCount}{" "}
                          records
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-500">
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete "${file.name}"? This action cannot be undone.`
                              )
                            ) {
                              deleteFile(file.id);
                            }
                          }}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                          title="Delete file"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reportData.length > 0 && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  You have {reportData.length} records ready for analysis.
                </p>
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === "dashboard" && (
          <>
            {reportData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No data available</p>
                <p className="text-gray-400 mb-6">
                  Upload some Siteimprove reports to get started
                </p>
                <button
                  onClick={() => setCurrentView("upload")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Reports
                </button>
              </div>
            ) : (
              <Dashboard data={reportData} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
