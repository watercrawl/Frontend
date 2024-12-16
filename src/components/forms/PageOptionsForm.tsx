import React from 'react';

export interface PageOptions {
  excludeTags: string;
  includeTags: string;
  waitTime: string;
  extractMainContent: boolean;
  includeHtml: boolean;
  includeLinks: boolean;
}

interface PageOptionsFormProps {
  options: PageOptions;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PageOptionsForm: React.FC<PageOptionsFormProps> = ({ options, onChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Input Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Options</h3>
        {/* First Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="excludeTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exclude Tags
            </label>
            <input
              type="text"
              name="excludeTags"
              id="excludeTags"
              value={options.excludeTags}
              onChange={onChange}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="script, .ad, #footer"
            />
          </div>

          <div>
            <label htmlFor="includeTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Include Only Tags
            </label>
            <input
              type="text"
              name="includeTags"
              id="includeTags"
              value={options.includeTags}
              onChange={onChange}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="script, .ad, #footer"
            />
          </div>
        </div>

        {/* Second Row */}
        <div>
          <label htmlFor="waitTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wait for (in ms)
          </label>
          <input
            type="text"
            name="waitTime"
            id="waitTime"
            value={options.waitTime}
            onChange={onChange}
            className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
            placeholder="1000"
          />
        </div>
      </div>

      {/* Right Side - Flags */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Flags</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="extractMainContent"
              id="extractMainContent"
              checked={options.extractMainContent}
              onChange={onChange}
              className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Extract only main content
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="includeHtml"
              id="includeHtml"
              checked={options.includeHtml}
              onChange={onChange}
              className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Include HTML content
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              name="includeLinks"
              id="includeLinks"
              checked={options.includeLinks}
              onChange={onChange}
              className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-700 dark:text-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
              Include page links
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
