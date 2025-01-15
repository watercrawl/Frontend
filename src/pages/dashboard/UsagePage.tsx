import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowTrendingUpIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { usageService } from '../../services/api/usage';
import { UsageResponse } from '../../types/common';

const UsagePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UsageResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await usageService.getUsageStats();
        setData(response);
      } catch (error) {
        console.error('Error fetching usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Failed to load usage data</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Usage Statistics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor your crawling activity and resource usage
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Crawl Requests</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {data.total_crawls?.toLocaleString()}
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
                {data.total_documents?.toLocaleString()}
              </p>
            </div>
            <div className="text-gray-400 dark:text-gray-500">
              <DocumentTextIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Finished Crawls</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {data.finished_crawls?.toLocaleString()}
              </p>
            </div>
            <div className="text-gray-400 dark:text-gray-500">
              <ClockIcon className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between space-x-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round((data.finished_crawls / data.total_crawls) * 100)}%
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center text-green-500">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="ml-1 text-sm">{data.finished_crawls}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crawls Chart */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Crawl Requests History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Number of crawl requests over time</p>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.crawl_history}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCrawls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  labelStyle={{ color: 'rgb(156 163 175)' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCrawls)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Documents Chart */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Results History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Number of results over time</p>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.document_history}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(31 41 55)', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }}
                  labelStyle={{ color: 'rgb(156 163 175)' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDocs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsagePage;
