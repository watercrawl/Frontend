import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { CrawlEvent, CrawlRequest, CrawlResult, CrawlStatus } from '../../types/crawl';
import { crawlService } from '../../services/api/crawl';
import { PageOptionsForm, PageOptions } from '../forms/PageOptionsForm';
import { SpiderOptionsForm, SpiderOptions } from '../forms/SpiderOptionsForm';
import { ResultsTable } from '../ResultsTable';
import PluginOptionsForm from './PluginOptionsForm';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface CrawlFormProps {
  showSpiderOptions: boolean;
  onRequestChange?: (request: CrawlRequest) => void;
}

export const CrawlForm: React.FC<CrawlFormProps> = ({showSpiderOptions, onRequestChange}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [formErrors, setFormErrors] = useState<{
    plugin?: boolean;
  }>({});

  const [pageOptions, setPageOptions] = useState<PageOptions>({
    excludeTags: '',
    includeTags: '',
    waitTime: '1000',
    extractMainContent: true,
    includeHtml: false,
    includeLinks: true,
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

  const [pluginOptions, setPluginOptions] = useState<Record<string, object>>({});

  // Add a shared function to filter active plugins
  const getActivePlugins = (plugins: Record<string, object>) => {
    return Object.entries(plugins).reduce((acc, [key, value]) => {
      if (value && typeof value === 'object' && 'is_active' in value && value.is_active) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, object>);
  };

  const updateRequest = () => {
    if (!url) return;
    
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
        plugin_options: getActivePlugins(pluginOptions)
      }
    } as CrawlRequest;

    onRequestChange?.(request);
  };

  useEffect(() => {
    updateRequest();
  }, [url, pageOptions, spiderOptions, pluginOptions]);

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

  const handlePluginOptionsChange = (formData: Record<string, object>) => {
    setPluginOptions(formData);
  };

  const handlePluginValidation = (hasErrors: boolean) => {
    setFormErrors(prev => ({ ...prev, plugin: hasErrors }));
  };

  const handleCrawlEvent = (event: CrawlEvent) => {
    if (event.type === 'state') {
      setCrawlStatus(prev => ({
        ...prev,
        request: event.data as CrawlRequest,
      }));
    } else if (event.type === 'result') {
      setCrawlStatus(prev => {
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

    // Check for validation errors
    if (formErrors.plugin) {
      toast.error('Please fix the validation errors before submitting');
      // Switch to the plugin tab if there are errors
      setSelectedTab(tabs.findIndex(tab => tab.name === 'Plugin Options'));
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
          plugin_options: getActivePlugins(pluginOptions)
        }
      } as CrawlRequest;

      onRequestChange?.(request);

      const response = await crawlService.createCrawlRequest(request);
      await crawlService.subscribeToStatus(
        response.uuid,
        handleCrawlEvent,
        () => setIsLoading(false)
      );

      // Scroll to results after a short delay to ensure the component has rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start crawling');
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!crawlStatus.request?.uuid) return;

    try {
      await crawlService.cancelCrawl(crawlStatus.request.uuid);
      toast.success('Crawl cancelled successfully');
      setIsLoading(false);
      setCrawlStatus(prev => ({
        ...prev,
        request: { ...prev.request!, status: 'cancelled' } as CrawlRequest,
      }));
    } catch (error) {
      console.error('Error cancelling crawl:', error);
      toast.error('Failed to cancel crawl');
    }
  };

  const tabs = [
    ...(showSpiderOptions ? [{ name: 'Spider Options', content: <SpiderOptionsForm options={spiderOptions} onChange={handleSpiderOptionsChange} /> }] : []),
    { name: 'Page Options', content: <PageOptionsForm options={pageOptions} onChange={handlePageOptionsChange} /> },
    { name: 'Plugin Options', content: <PluginOptionsForm onChange={handlePluginOptionsChange} onValidation={handlePluginValidation} /> },
  ];

  return (
    <div>
      <div className="max-w-3xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                name="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-10 px-3 bg-transparent border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
                placeholder="https://example.com"
              />
              {crawlStatus.request?.status === 'running' ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel Crawling
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || formErrors.plugin}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Crawling...' : 'Start Crawling'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'px-4 py-2.5 text-sm font-medium leading-5',
                        selected
                          ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                        // Add red indicator for tabs with errors
                        (tab.name === 'Plugin Options' && formErrors.plugin)
                          ? 'text-red-500 dark:text-red-400'
                          : ''
                      )
                    }
                  >
                    {tab.name}
                    {/* Add error indicator */}
                    {(tab.name === 'Plugin Options' && formErrors.plugin) && (
                      <span className="ml-2 text-red-500">⚠️</span>
                    )}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-4">
                {tabs.map((tab, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={`p-6 border rounded-lg ${
                      (tab.name === 'Plugin Options' && formErrors.plugin)
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {tab.content}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </form>
      </div>

      {crawlStatus.request && (
        <div className="mt-8" ref={resultsRef}>
          <ResultsTable 
            request={crawlStatus.request}
            results={crawlStatus.results}
            isExpanded={crawlStatus.isExpanded}
            isLoading={isLoading}
            onRowClick={() => setCrawlStatus(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
          />
        </div>
      )}
    </div>
  );
};
