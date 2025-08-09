import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Download, Eye, Trash2 } from "lucide-react";
import { ReportData } from "../types";

interface DataTableProps {
  data: ReportData[];
  onExport: () => void;
  onRowClick?: (item: ReportData) => void;
  onDeleteRecord?: (recordId: string) => void;
  onDeleteMultipleRecords?: (recordIds: string[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  onExport,
  onRowClick,
  onDeleteRecord,
  onDeleteMultipleRecords,
}) => {
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortField];
      const bValue = (b as any)[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const getColumns = () => {
    if (data.length === 0) return [];

    const firstItem = data[0];
    return Object.keys(firstItem).filter((key) => key !== "id");
  };

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "...";
    }
    return String(value);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No data to display</p>
          <p className="text-gray-400 text-sm">
            Upload some reports to see data here
          </p>
        </div>
      </div>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((item) => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) return;

    const selectedIds = Array.from(selectedRows);
    const confirmMessage =
      selectedIds.length === 1
        ? `Are you sure you want to delete this record? This action cannot be undone.`
        : `Are you sure you want to delete ${selectedIds.length} records? This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      if (selectedIds.length === 1) {
        onDeleteRecord?.(selectedIds[0]);
      } else {
        onDeleteMultipleRecords?.(selectedIds);
      }
      setSelectedRows(new Set());
    }
  };

  const handleDeleteSingle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    if (
      window.confirm(
        "Are you sure you want to delete this record? This action cannot be undone."
      )
    ) {
      onDeleteRecord?.(id);
    }
  };

  const columns = getColumns();
  const hasDeleteFunctions = onDeleteRecord || onDeleteMultipleRecords;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Table ({sortedData.length} records)
          </h3>
          {hasDeleteFunctions && selectedRows.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedRows.size})
            </button>
          )}
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {hasDeleteFunctions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {column
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    <SortIcon field={column} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedRows.has(item.id) ? "bg-blue-50" : ""
                }`}
              >
                {hasDeleteFunctions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.id)}
                      onChange={(e) =>
                        handleSelectRow(item.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                    onClick={() => onRowClick?.(item)}
                  >
                    {formatValue((item as any)[column])}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    {onRowClick && (
                      <button
                        onClick={() => onRowClick(item)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onDeleteRecord && (
                      <button
                        onClick={(e) => handleDeleteSingle(item.id, e)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
