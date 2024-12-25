import React, { useMemo } from 'react';
import { Tab } from '@headlessui/react';
import { CrawlRequest } from '../../types/crawl';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../utils/env';

interface ApiDocumentationProps {
  request: CrawlRequest | null;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (err) {
    toast.error('Failed to copy to clipboard');
  }
};

export const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ request }) => {
  const generateCurlCommand = (request: CrawlRequest | null) => {
    if (!request) return 'No request data available';
    
    const data = {
      url: request.url,
      options: request.options
    };
    
    return `curl -X POST \\
  "${API_URL}/api/v1/core/crawl-requests/" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: TEAM_API_KEY" \\
  -d '${JSON.stringify(data, null, 2)}'`;
  };

  const generatePythonCode = (_: CrawlRequest | null) => {
    return `Coming soon...

# The API endpoint will be:
# POST ${API_URL}/api/v1/core/crawl-requests/
# Headers: X-API-Key: TEAM_API_KEY`;
  };

  const generateNodeCode = (_: CrawlRequest | null) => {
    return `Coming soon...

// The API endpoint will be:
// POST ${API_URL}/api/v1/core/crawl-requests/
// Headers: X-API-Key: TEAM_API_KEY`;
  };

  const generateGoCode = (_: CrawlRequest | null) => {
    return `Coming soon...

// The API endpoint will be:
// POST ${API_URL}/api/v1/core/crawl-requests/
// Headers: X-API-Key: TEAM_API_KEY`;
  };

  const tabs = useMemo(() => [
    { name: 'cURL', content: generateCurlCommand(request) },
    { name: 'Python', content: generatePythonCode(request) },
    { name: 'Node.js', content: generateNodeCode(request) },
    { name: 'Go', content: generateGoCode(request) },
  ], [request]);

  if (!request) {
    return (
      <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">API Documentation</h3>
        <p className="text-gray-500 dark:text-gray-400">Enter a URL and configure options to see the API request example.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">API Documentation</h3>
        <button
          onClick={() => copyToClipboard(tabs[0].content)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          <ClipboardIcon className="h-4 w-4 mr-1.5" />
          Copy cURL
        </button>
      </div>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                  selected
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className="rounded-xl bg-gray-900 p-4 text-sm text-gray-200 font-mono whitespace-pre overflow-x-auto"
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
