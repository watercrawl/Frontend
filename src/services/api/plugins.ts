import api from './api';

export const pluginsService = {
  async getPluginSchema() {
    const { data } = await api.get('/api/v1/core/plugins/schema');
    return data;
  },
};
