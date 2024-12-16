import React from 'react';
import { ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { CrawlRequest } from '../../types/crawl';
import { getStatusColor } from '../../utils/statusColors';
import { activityLogsService } from '../../services/api/activityLogs';
import { toast } from 'react-hot-toast';

interface ActivityLogRowProps {
  request: CrawlRequest;
  isExpanded: boolean;
  onRowClick: (uuid: string) => void;
  showDates?: boolean;
}

export const ActivityLogRow: React.FC<ActivityLogRowProps> = ({
  request,
  isExpanded,
  onRowClick,
  showDates = true
}) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row expansion when clicking download
    
    if (!request.uuid) return;
    
    try {
      const blob = await activityLogsService.downloadResults(request.uuid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crawl-results-${request.uuid}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading results:', error);
      toast.error('Failed to download results');
    }
  };

  return (
    <tr 
      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
      onClick={() => request.uuid && onRowClick(request.uuid)}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white flex items-center">
        {isExpanded ? (
          <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-400" />
        )}
        {request.url}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {request.number_of_documents || 0}
      </td>
      {showDates && (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
          </td>
        </>
      )}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <button
          onClick={handleDownload}
          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          title="Download Results"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
};
