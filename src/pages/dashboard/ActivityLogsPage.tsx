import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultModal from '../../components/ResultModal';
import { CrawlRequestCard } from '../../components/shared/CrawlRequestCard';
import { EmptyState } from '../../components/activity-logs/EmptyState';
import { PaginatedResponse } from '../../types/common';
import { CrawlRequest, CrawlResult } from '../../types/crawl';
import { activityLogsApi } from '../../services/api/activityLogs';
import { useIsTabletOrMobile } from '../../hooks/useMediaQuery';
import { Pagination } from '../../components/shared/Pagination';
import { ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { formatDuration } from '../../utils/formatters';


const ActivityLogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [crawlRequests, setCrawlRequests] = useState<PaginatedResponse<CrawlRequest> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<CrawlResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTabletOrMobile = useIsTabletOrMobile();

  const fetchCrawlRequests = async (page: number) => {
    try {
      setLoading(true);
      const data = await activityLogsApi.listCrawlRequests(page);
      setCrawlRequests(data);
    } catch (error) {
      console.error('Error fetching crawl requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrawlRequests(currentPage);
  }, [currentPage]);


  const handleDownload = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    try {
      const blob = await activityLogsApi.downloadResults(requestId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crawl-results-${requestId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      // toast.success('Download started');
    } catch (error) {
      console.error('Error downloading results:', error);
      // toast.error('Failed to download results');
    }
  };

  const handleViewDetails = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    navigate(`/dashboard/logs/${requestId}`);
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
      <div className="px-4 sm:px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your recent crawl requests and their results
        </p>

        <div className="mt-8">
          {hasNoData ? (
            <EmptyState />
          ) : (
            <>
              {/* Mobile and Tablet Card View */}
              {isTabletOrMobile ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {crawlRequests?.results.map((request) => (
                      <CrawlRequestCard
                        key={request.uuid}
                        request={request}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Desktop Table View */
                <div className="mt-8 flex flex-col">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                URL
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Results
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Created
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                Duration
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {crawlRequests?.results.map((request) => (
                              <React.Fragment key={request.uuid}>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                    <div className="flex items-center">
                                      <span className="max-w-[300px] truncate" title={request.url}>
                                        {request.url}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                                    <StatusBadge status={request.status} />
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {request.number_of_documents}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDuration(request.duration, request.created_at)}
                                  </td>
                                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <div className="flex justify-end space-x-3">
                                      <button
                                        onClick={(e) => handleDownload(e, request.uuid)}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                        title="Download Results"
                                      >
                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                      </button>
                                      <button
                                        onClick={(e) => handleViewDetails(e, request.uuid)}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                        title="View Details"
                                      >
                                        <EyeIcon className="h-5 w-5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination - Same for all views */}
              {crawlRequests && crawlRequests.count > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={crawlRequests.count}
                  hasNextPage={!!crawlRequests.next}
                  hasPreviousPage={!!crawlRequests.previous}
                  onPageChange={setCurrentPage}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {selectedResult && (
        <ResultModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedResult(null);
          }}
          result={selectedResult}
        />
      )}
    </div>
  );
};

export default ActivityLogsPage;
