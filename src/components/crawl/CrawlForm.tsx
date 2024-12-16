import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { CrawlEvent, CrawlRequest, CrawlResult, CrawlStatus } from '../../types/crawl';
import { crawlService } from '../../services/api/crawl';
import { PageOptionsForm, PageOptions } from '../forms/PageOptionsForm';
import { SpiderOptionsForm, SpiderOptions } from '../forms/SpiderOptionsForm';
import { ResultsTable } from '../ResultsTable';
import { LLMOptionsForm } from '../forms/LLMOptionsForm';

interface CrawlFormProps {
  showSpiderOptions: boolean;
}

export const CrawlForm: React.FC<CrawlFormProps> = ({showSpiderOptions}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    excludeTags: '',
    includeTags: '',
    waitTime: '1000',
    extractMainContent: true,
    includeHtml: false,
    includeLinks: true,
  });

  const [llmOptions, setLlmOptions] = useState({
    llmModel: '',
    extractorSchema: '',
  });

  const [spiderOptions, setSpiderOptions] = useState<SpiderOptions>({
    maxDepth: '1',
    pageLimit: '1',
    allowedDomains: '',
    excludePaths: '',
    includePaths: '',
  });
  
  const [crawlStatus, setCrawlStatus] = useState<CrawlStatus>({
    request: null,
    results: [],
    isExpanded: true,
  });

  const handlePageOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPageOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSpiderOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpiderOptions(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLlmOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLlmOptions(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCrawlEvent = (event: CrawlEvent) => {
    if (event.type === 'state') {
      setCrawlStatus(prev => ({
        ...prev,
        request: event.data as CrawlRequest,
      }));
    } else if (event.type === 'result') {
      setCrawlStatus(prev => {
        // duplicate check
        if (prev.results.some(result => result.uuid === (event.data as CrawlResult).uuid)) {
          return prev;
        }

        return {
          ...prev,
          results: [...prev.results, event.data as CrawlResult],
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setCrawlStatus({ request: null, results: [], isExpanded: true });

    try {
      const request = {
        url,
        options: {
          spider_options: {
            max_depth: parseInt(spiderOptions.maxDepth),
            page_limit: parseInt(spiderOptions.pageLimit),
            allowed_domains: spiderOptions.allowedDomains.split(',').map(domain => domain.trim()).filter(Boolean),
            exclude_paths: spiderOptions.excludePaths.split(',').map(path => path.trim()).filter(Boolean),
            include_paths: spiderOptions.includePaths.split(',').map(path => path.trim()).filter(Boolean),
          },
          page_options: {
            exclude_tags: pageOptions.excludeTags.split(',').map(tag => tag.trim()).filter(Boolean),
            include_tags: pageOptions.includeTags.split(',').map(tag => tag.trim()).filter(Boolean),
            wait_time: parseInt(pageOptions.waitTime),
            only_main_content: pageOptions.extractMainContent,
            include_html: pageOptions.includeHtml,
            include_links: pageOptions.includeLinks,
          },
          plugin_options: {
            llm_model: llmOptions.llmModel,
            extractor_schema: llmOptions.extractorSchema,
          }
        }
      } as CrawlRequest;

      const response = await crawlService.createCrawlRequest(request);
      await crawlService.subscribeToStatus(
        response.uuid,
        handleCrawlEvent,
        () => setIsLoading(false)
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start crawling');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-4">
            {showSpiderOptions && (
            <Disclosure>
              {({ open }) => (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Disclosure.Button className="flex w-full justify-between rounded-t-lg bg-gray-100 dark:bg-gray-800 px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                    <span>Spider Options</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 py-6 text-sm text-gray-500">
                    <SpiderOptionsForm options={spiderOptions} onChange={handleSpiderOptionsChange} />
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
            )}

            <Disclosure>
              {({ open }) => (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Disclosure.Button className="flex w-full justify-between rounded-t-lg bg-gray-100 dark:bg-gray-800 px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                    <span>Page Options</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 py-6 text-sm text-gray-500">
                    <PageOptionsForm options={pageOptions} onChange={handlePageOptionsChange} />
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Disclosure.Button className="flex w-full justify-between rounded-t-lg bg-gray-100 dark:bg-gray-800 px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
                    <span>LLM Options</span>
                    <ChevronUpIcon
                      className={`${
                        open ? 'rotate-180 transform' : ''
                      } h-5 w-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-6 py-6 text-sm text-gray-500">
                    <LLMOptionsForm options={llmOptions} onChange={handleLlmOptionsChange} />
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center h-10 px-4 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Request...' : 'Start Crawling'}
            </button>
          </div>
        </form>
      </div>
      <div>
        {/* Crawl Status Section */}
        {crawlStatus.request && (
          <ResultsTable
            request={crawlStatus.request}
            results={crawlStatus.results}
            isExpanded={!!crawlStatus.isExpanded}
            isLoading={isLoading}
            onRowClick={() => setCrawlStatus(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
          />
        )}
      </div>
    </div>
  );
};
