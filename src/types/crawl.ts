export interface CrawlRequest {
  uuid: string;
  url: string;
  status: 'new' | 'running' | 'cancelled' | 'canceling' | 'failed' | 'finished';
  options: CrawlOptions;
  created_at: string;
  updated_at: string;
  number_of_documents: number;
}

export interface CrawlResult {
  uuid: string;
  title: string;
  url: string;
  result: string;
  created_at: string;
}


export interface PageOptions {
  exclude_tags: string[];
  include_tags: string[];
  wait_time: number;
  include_html: boolean;
  only_main_content: boolean;
  include_links: boolean;
}

export interface SpiderOptions {
  max_depth?: number;
  page_limit?: number;
  allowed_domains?: string[];
  exclude_paths?: string[];
  include_paths?: string[];
}

export interface CrawlOptions {
  spider_options: SpiderOptions;
  page_options: PageOptions;
  plugin_options?: {
    llm_model?: string;
    extractor_schema?: string;
  };
}


export interface CrawlEvent {
  type: 'state' | 'result';
  data: CrawlRequest | CrawlResult;
}


export interface CrawlStatus {
  request: CrawlRequest | null;
  results: CrawlResult[];
  isExpanded: boolean;
}