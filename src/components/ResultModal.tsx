import { useState, useEffect } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Editor from "@monaco-editor/react";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultUrl: string;
}

interface ResultData {
  markdown?: string;
  links?: string[];
  raw?: any;
}

export default function ResultModal({ isOpen, onClose, resultUrl }: ResultModalProps) {
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(resultUrl);
        const jsonData = await response.json();
        setData({
          markdown: jsonData.markdown || '',
          links: jsonData.links || [],
          raw: jsonData
        });
      } catch (error) {
        console.error('Error fetching result data:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && resultUrl) {
      fetchData();
    }
  }, [isOpen, resultUrl]);

  if (!isOpen) return null;

  const getTabClassName = (selected: boolean) => {
    return `${selected ? 'bg-white dark:bg-gray-700 shadow' : ''} w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 px-4`;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Result Preview
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
              </div>
            ) : data ? (
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700/50 p-1">
                  <Tab className={({ selected }) => getTabClassName(selected)}>
                    Markdown
                  </Tab>
                  <Tab className={({ selected }) => getTabClassName(selected)}>
                    JSON
                  </Tab>
                  {data.links && data.links.length > 0 && (
                  <Tab className={({ selected }) => getTabClassName(selected)}>
                    Links
                  </Tab>
                  )}
                </Tab.List>
                <Tab.Panels className="mt-4">
                  <Tab.Panel className="rounded-lg bg-white dark:bg-gray-800 p-4 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-100 font-mono h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4">
                      {data.markdown || ''}
                    </pre>
                  </Tab.Panel>
                  <Tab.Panel className="rounded-lg bg-white dark:bg-gray-800 p-4 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <div className="h-96">
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={JSON.stringify(data.raw || {}, null, 2)}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 12,
                          theme: 'vs-dark'
                        }}
                      />
                    </div>
                  </Tab.Panel>
                  {data.links && data.links.length > 0 && (
                  <Tab.Panel className="rounded-lg bg-white dark:bg-gray-800 p-4 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
                    <div className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-100 font-mono h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4">
                      {(data.links || []).map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </Tab.Panel>
                  )}
                </Tab.Panels>
              </Tab.Group>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Failed to load result data
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
