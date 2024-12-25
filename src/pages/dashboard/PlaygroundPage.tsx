import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { MapIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import SpiderIcon from '../../components/icons/SpiderIcon';
import { CrawlForm } from '../../components/crawl/CrawlForm';
import { ApiDocumentation } from '../../components/playground/ApiDocumentation';
import { CrawlRequest } from '../../types/crawl';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const PlaygroundPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentRequest, setCurrentRequest] = useState<CrawlRequest | null>(null);

  const handleRequestChange = (request: CrawlRequest) => {
    setCurrentRequest(request);
  };

  return (
    <div className="h-full">
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Playground</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Test and experiment with different crawling configurations in real-time.
          </p>
          <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 max-w-md">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                          selected
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'
                        )
                      }
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <SpiderIcon className="h-5 w-5" />
                        <span>Single Page</span>
                      </div>
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                          selected
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'
                        )
                      }
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <GlobeAltIcon className="h-5 w-5" />
                        <span>Crawl Website</span>
                      </div>
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none',
                          selected
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white'
                        )
                      }
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <MapIcon className="h-5 w-5" />
                        <span>Map</span>
                      </div>
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-8">
                    <Tab.Panel>
                      <CrawlForm
                        showSpiderOptions={false}
                        onRequestChange={handleRequestChange}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <CrawlForm
                        showSpiderOptions={true}
                        onRequestChange={handleRequestChange}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        Coming Soon
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
              <div>
                <ApiDocumentation request={currentRequest} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
