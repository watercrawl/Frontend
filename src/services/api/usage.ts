import { UsageResponse } from '../../types/common';
import api from './api';



export const usageService = {
  async getUsageStats(): Promise<UsageResponse> {
    const { data } = await api.get<UsageResponse>('/api/v1/core/usage/');
    return data;
  },
};
