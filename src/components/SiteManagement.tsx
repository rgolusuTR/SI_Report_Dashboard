import React from "react";
import { Settings, ArrowLeft, Globe } from "lucide-react";
import { Website } from "../types";
import { WebsiteManager } from "./WebsiteManager";

interface SiteManagementProps {
  websites: Website[];
  onAddWebsite: (website: Omit<Website, "id">) => void;
  onUpdateWebsite: (id: string, website: Omit<Website, "id">) => void;
  onDeleteWebsite: (id: string) => void;
  onBack: () => void;
}

export const SiteManagement: React.FC<SiteManagementProps> = ({
  websites,
  onAddWebsite,
  onUpdateWebsite,
  onDeleteWebsite,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Site Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Website Management
                </h2>
                <p className="text-gray-600">
                  Manage your websites for Siteimprove reporting and analysis
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Total Websites
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {websites.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Settings className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Active Domains
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {websites.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Configured Sites
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {websites.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Manager */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <WebsiteManager
            websites={websites}
            onAddWebsite={onAddWebsite}
            onUpdateWebsite={onUpdateWebsite}
            onDeleteWebsite={onDeleteWebsite}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            How to Use Website Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                Adding Websites
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click "Add Website" to create a new website entry</li>
                <li>• Enter a descriptive name for the website</li>
                <li>• Provide the domain URL (e.g., example.com)</li>
                <li>• Save to make it available in reports and uploads</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                Managing Websites
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use the edit icon to modify website details</li>
                <li>• Delete websites that are no longer needed</li>
                <li>• Changes are automatically saved and synced</li>
                <li>• Updated websites appear in filters and upload forms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
