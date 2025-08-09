import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { Website } from "../types";

interface WebsiteManagerProps {
  websites: Website[];
  onAddWebsite: (website: Omit<Website, "id">) => void;
  onUpdateWebsite: (id: string, website: Omit<Website, "id">) => void;
  onDeleteWebsite: (id: string) => void;
}

export const WebsiteManager: React.FC<WebsiteManagerProps> = ({
  websites,
  onAddWebsite,
  onUpdateWebsite,
  onDeleteWebsite,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWebsite, setNewWebsite] = useState({ name: "", domain: "" });
  const [editWebsite, setEditWebsite] = useState({ name: "", domain: "" });

  const handleAddWebsite = () => {
    if (newWebsite.name.trim() && newWebsite.domain.trim()) {
      onAddWebsite({
        name: newWebsite.name.trim(),
        domain: newWebsite.domain.trim(),
      });
      setNewWebsite({ name: "", domain: "" });
      setIsAdding(false);
    }
  };

  const handleEditWebsite = (website: Website) => {
    setEditingId(website.id);
    setEditWebsite({ name: website.name, domain: website.domain });
  };

  const handleSaveEdit = () => {
    if (editingId && editWebsite.name.trim() && editWebsite.domain.trim()) {
      onUpdateWebsite(editingId, {
        name: editWebsite.name.trim(),
        domain: editWebsite.domain.trim(),
      });
      setEditingId(null);
      setEditWebsite({ name: "", domain: "" });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditWebsite({ name: "", domain: "" });
  };

  const handleDeleteWebsite = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      onDeleteWebsite(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Website Management
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Website
        </button>
      </div>

      {/* Add New Website Form */}
      {isAdding && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Add New Website
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={newWebsite.name}
                onChange={(e) =>
                  setNewWebsite({ ...newWebsite, name: e.target.value })
                }
                placeholder="e.g., Legal Thomson Reuters"
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Domain</label>
              <input
                type="text"
                value={newWebsite.domain}
                onChange={(e) =>
                  setNewWebsite({ ...newWebsite, domain: e.target.value })
                }
                placeholder="e.g., legal.thomsonreuters.com"
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddWebsite}
              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
            >
              <Save className="h-3 w-3" />
              Save
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewWebsite({ name: "", domain: "" });
              }}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Website List */}
      <div className="space-y-2">
        {websites.map((website) => (
          <div
            key={website.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            {editingId === website.id ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 mr-3">
                <input
                  type="text"
                  value={editWebsite.name}
                  onChange={(e) =>
                    setEditWebsite({ ...editWebsite, name: e.target.value })
                  }
                  className="p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={editWebsite.domain}
                  onChange={(e) =>
                    setEditWebsite({ ...editWebsite, domain: e.target.value })
                  }
                  className="p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div className="flex-1">
                <p className="font-medium text-gray-900">{website.name}</p>
                <p className="text-sm text-gray-600">{website.domain}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              {editingId === website.id ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Save changes"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    title="Cancel editing"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditWebsite(website)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Edit website"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteWebsite(website.id, website.name)
                    }
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete website"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {websites.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No websites configured</p>
          <p className="text-sm">Click "Add Website" to get started</p>
        </div>
      )}
    </div>
  );
};
