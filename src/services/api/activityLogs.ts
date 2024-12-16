import { PaginatedResponse } from '../../types/common';
import { CrawlRequest, CrawlResult } from '../../types/crawl';
import api from './api';

export const activityLogsService = {
  async listCrawlRequests(page: number): Promise<PaginatedResponse<CrawlRequest>> {
    const { data } = await api.get<PaginatedResponse<CrawlRequest>>(`/api/v1/core/crawl-requests/`, {
      params: { page }
    });
    return data;
  },

  async getCrawlResults(requestId: string, page: number = 1): Promise<PaginatedResponse<CrawlResult>> {
    const { data } = await api.get<PaginatedResponse<CrawlResult>>(
      `/api/v1/core/crawl-requests/${requestId}/results/`,
      { params: { page } }
    );
    return data;
  },

  async downloadResults(requestId: string): Promise<Blob> {
    const response = await api.get(`/api/v1/core/crawl-requests/${requestId}/download/`, {
      responseType: 'blob'
    });
    return response.data;
  },
};
