import React from 'react';
import { FormInput, InfoTooltip, OptionGroup } from '../shared/FormComponents';

export interface SpiderOptions {
  maxDepth: string;
  pageLimit: string;
  allowedDomains: string;
  excludePaths: string;
  includePaths: string;
}

interface SpiderOptionsFormProps {
  options: SpiderOptions;
  onChange: (options: Partial<SpiderOptions>) => void;
}

export const SpiderOptionsForm: React.FC<SpiderOptionsFormProps> = ({ options, onChange }) => {
  const handleInputChange = (name: keyof SpiderOptions, value: string) => {
    onChange({ [name]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Crawler Settings */}
      <div className="space-y-6">
        <OptionGroup
          title="Crawler Settings"
          description="Configure how deep and wide the crawler should go"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Depth
                  </label>
                  <InfoTooltip content="Maximum depth of pages to crawl from the starting URL" />
                </div>
                <FormInput
                  label=""
                  type="number"
                  value={options.maxDepth}
                  onChange={(value) => handleInputChange('maxDepth', value)}
                  placeholder="1"
                />
              </div>
              
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Page Limit
                  </label>
                  <InfoTooltip content="Maximum number of pages to crawl" />
                </div>
                <FormInput
                  label=""
                  type="number"
                  value={options.pageLimit}
                  onChange={(value) => handleInputChange('pageLimit', value)}
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Allowed Domains
                </label>
                <InfoTooltip content="Comma-separated list of domains to crawl (e.g., example.com, sub.example.com)" />
              </div>
              <FormInput
                label=""
                value={options.allowedDomains}
                onChange={(value) => handleInputChange('allowedDomains', value)}
                placeholder="example.com, sub.example.com"
              />
            </div>
          </div>
        </OptionGroup>
      </div>

      {/* Right Column - Path Filters */}
      <div className="space-y-6">
        <OptionGroup
          title="Path Filters"
          description="Specify which paths to include or exclude from crawling"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Exclude Paths
                </label>
                <InfoTooltip content="Comma-separated list of paths to exclude from crawling (e.g., /login, /admin)" />
              </div>
              <FormInput
                label=""
                value={options.excludePaths}
                onChange={(value) => handleInputChange('excludePaths', value)}
                placeholder="/login, /admin"
              />
            </div>

            <div>
              <div className="flex items-center space-x-1 mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Paths
                </label>
                <InfoTooltip content="Comma-separated list of paths to include in crawling (e.g., /blog, /docs)" />
              </div>
              <FormInput
                label=""
                value={options.includePaths}
                onChange={(value) => handleInputChange('includePaths', value)}
                placeholder="/blog, /docs"
              />
            </div>
          </div>
        </OptionGroup>
      </div>
    </div>
  );
};
