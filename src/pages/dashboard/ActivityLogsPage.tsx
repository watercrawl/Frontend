import React, { useState, useEffect } from 'react';
import ResultModal from '../../components/ResultModal';
import { ActivityLogRow } from '../../components/activity-logs/ActivityLogRow';
import { EmptyState } from '../../components/activity-logs/EmptyState';
import { PaginatedResponse } from '../../types/common';
import { CrawlRequest, CrawlResult } from '../../types/crawl';
import { activityLogsService } from '../../services/api/activityLogs';
import { ActivityLogExpandedRow } from '../../components/activity-logs/ActivityLogExpandedRow';

const ActivityLogsPage: React.FC = () => {
  const [crawlRequests, setCrawlRequests] = useState<PaginatedResponse<CrawlRequest> | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: PaginatedResponse<CrawlResult> }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCrawlRequests = async (page: number) => {
    try {
      setLoading(true);
      const data = await activityLogsService.listCrawlRequests(page);
      setCrawlRequests(data);
    } catch (error) {
      console.error('Error fetching crawl requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrawlResults = async (requestId: string, page: number = 1) => {
    if (!requestId) {
      console.error('Request ID is undefined');
      return;
    }

    setLoadingResults(prev => ({ ...prev, [requestId]: true }));

    try {
      const data = await activityLogsService.getCrawlResults(requestId, page);
      setResults(prev => ({
        ...prev,
        [requestId]: data
      }));
    } catch (error) {
      console.error('Error fetching crawl results:', error);
      setResults(prev => ({
        ...prev,
        [requestId]: { count: 0, next: null, previous: null, results: [] }
      }));
    } finally {
      setLoadingResults(prev => ({ ...prev, [requestId]: false }));
    }
  };

  useEffect(() => {
    fetchCrawlRequests(currentPage);
  }, [currentPage]);

  const handleRowClick = async (requestId: string) => {
    if (!requestId) {
      console.error('Request ID is undefined');
      return;
    }

    if (expandedRequest === requestId) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(requestId);
      if (!results[requestId]) {
        await fetchCrawlResults(requestId);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  const hasNoData = !crawlRequests || crawlRequests.count === 0;

  return (
    <div className="h-full">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your recent crawl requests and their results
        </p>

        <div className="mt-8">
          {hasNoData ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {crawlRequests?.results.map((request) => (
                    <React.Fragment key={request.uuid}>
                      <ActivityLogRow
                        request={request}
                        isExpanded={expandedRequest === request.uuid}
                        onRowClick={handleRowClick}
                      />
                      {expandedRequest === request.uuid && (
                        <tr>
                          <td colSpan={6}>
                            <ActivityLogExpandedRow
                              results={results[request.uuid]?.results || []}
                              isLoading={loadingResults[request.uuid]}
                              onPreviewClick={(result: CrawlResult) => {
                                setSelectedResult(result.result);
                                setIsModalOpen(true);
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {crawlRequests && crawlRequests.count > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                  <div className="flex justify-between flex-1 sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!crawlRequests.previous}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!crawlRequests.next}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resultUrl={selectedResult || ''}
      />
    </div>
  );
};

export default ActivityLogsPage;
