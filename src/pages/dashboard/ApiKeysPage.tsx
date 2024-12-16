import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Dialog } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
import { apiKeysService } from '../../services/api/apiKeys';
import { ApiKey } from '../../types/apiKeys';


const ApiKeysPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newKeyName, setNewKeyName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const fetchApiKeys = async (page: number) => {
    try {
      setLoading(true);
      const data = await apiKeysService.list(page);
      setApiKeys(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys(currentPage);
  }, [currentPage]);

  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newKey = await apiKeysService.create(newKeyName);
      setApiKeys(prev => [...prev, newKey]);
      setNewKeyName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating API key:', error);
    }
  };

  const deleteApiKey = async (uuid: string) => {
    try {
      setDeletingKey(uuid);
      await apiKeysService.delete(uuid);
      setApiKeys(prev => prev.filter(key => key.uuid !== uuid));
    } catch (error) {
      console.error('Error deleting API key:', error);
    } finally {
      setDeletingKey(null);
    }
  };

  const toggleKeyVisibility = (keyPk: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyPk]: !prev[keyPk],
    }));
  };

  const copyToClipboard = async (key: string, keyPk: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyPk);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const maskApiKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key;
    return `${key.slice(0, 5)}${'•'.repeat(20)}`;
  };

  return (
    <div className="h-full">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">API Keys</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your API keys for accessing the WaterCrawl API
        </p>

        <div className="space-y-8 mt-8">
          {/* API Keys List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">API Keys List</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center h-10 px-4 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New API Key
              </button>
            </div>

            <div className="mt-2 ring-1 ring-gray-300 dark:ring-gray-700 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      API Key
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Created
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {apiKeys.length > 0 ? (
                    apiKeys.map((apiKey) => (
                      <tr key={apiKey.uuid} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {apiKey.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {maskApiKey(apiKey.key, visibleKeys[apiKey.uuid ])}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(apiKey.created_at), { addSuffix: true })}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-3">
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.uuid)}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            {visibleKeys[apiKey.uuid] ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key, apiKey.uuid)}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            {copiedKey === apiKey.uuid ? (
                              <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <ClipboardDocumentIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this API key?')) {
                                deleteApiKey(apiKey.uuid);
                              }
                            }}
                            disabled={deletingKey === apiKey.uuid}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0h-4"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API keys</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Get started by creating a new API key.
                          </p>
                          <div className="mt-6">
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="inline-flex items-center h-10 px-4 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
                            >
                              <PlusIcon className="h-5 w-5 mr-2" />
                              Create New API Key
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  className="inline-flex items-center h-10 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                  className="inline-flex items-center h-10 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewKeyName('');
        }}
        className="relative z-50"
      >
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-[600px] rounded-md bg-white dark:bg-gray-800 p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create New API Key
            </Dialog.Title>
            <form onSubmit={createApiKey} className="space-y-4">
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key Name
                </label>
                <input
                  type="text"
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-gray-500 focus:ring-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-400 dark:placeholder-gray-400"
                  placeholder="Enter API key name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewKeyName('');
                  }}
                  className="h-10 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
                >
                  Create Key
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ApiKeysPage;
