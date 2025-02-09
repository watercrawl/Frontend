import React from 'react';
import { ArrowTrendingUpIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface UsageStatsGridProps {
  totalCrawls: number;
  totalDocuments: number;
  finishedCrawls: number;
}

export const UsageStatsGrid: React.FC<UsageStatsGridProps> = ({
  totalCrawls,
  totalDocuments,
  finishedCrawls,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Crawl Requests</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {totalCrawls?.toLocaleString()}
            </p>
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            <ArrowTrendingUpIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Results</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {totalDocuments?.toLocaleString()}
            </p>
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            <DocumentTextIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:block hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Finished Crawls</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {finishedCrawls?.toLocaleString()}
            </p>
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            <ClockIcon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:block hidden">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {Math.round((finishedCrawls / totalCrawls) * 100)}%
            </p>
          </div>
          <div className="flex items-center">
            <div className="flex items-center text-green-500">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="ml-1 text-sm">{finishedCrawls}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStatsGrid;
