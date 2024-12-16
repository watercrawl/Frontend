import React from 'react';

export interface SpiderOptions {
  maxDepth: string;
  pageLimit: string;
  allowedDomains: string;
  excludePaths: string;
  includePaths: string;
}

interface SpiderOptionsFormProps {
  options: SpiderOptions;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export const SpiderOptionsForm: React.FC<SpiderOptionsFormProps> = ({ options, onChange }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Side - Input Fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Crawler Settings</h3>
        {/* First Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxDepth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Depth
            </label>
            <input
              type="text"
              name="maxDepth"
              id="maxDepth"
              value={options.maxDepth}
              onChange={onChange}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="1"
            />
          </div>

          <div>
            <label htmlFor="pageLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Page Limit
            </label>
            <input
              type="text"
              name="pageLimit"
              id="pageLimit"
              value={options.pageLimit}
              onChange={onChange}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="1"
            />
          </div>
        </div>

        {/* Second Row */}
        <div>
          <label htmlFor="allowedDomains" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Allowed Domains (comma-separated)
          </label>
          <input
            type="text"
            name="allowedDomains"
            id="allowedDomains"
            value={options.allowedDomains}
            onChange={onChange}
            className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
            placeholder="example.com, sub.example.com"
          />
        </div>
      </div>

      {/* Right Side - Path Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Path Filters</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="excludePaths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exclude Paths (comma-separated)
            </label>
            <input
              type="text"
              name="excludePaths"
              id="excludePaths"
              value={options.excludePaths}
              onChange={onChange}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="/admin/*, /api/*"
            />
          </div>

          <div>
            <label htmlFor="includePaths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Include Paths (comma-separated)
            </label>
            <input
              type="text"
              name="includePaths"
              id="includePaths"
              value={options.includePaths}
              onChange={onChange}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="/blog/*, /docs/*"
            />
          </div>
        </div>
      </div>
    </div>);
};
