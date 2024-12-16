import api from './api';
import { Team } from '../../types/team';

export const teamApi = {
  getCurrentTeam: () => api.get<Team>('/api/v1/user/teams/current/'),
  listTeams: () => api.get<Team[]>('/api/v1/user/teams/'),
  createTeam: (name: string) => api.post<Team>('/api/v1/user/teams/', { name }),
  updateTeam: (id: string, name: string) => api.put<Team>(`/api/v1/user/teams/${id}/`, { name }),
  getTeam: (id: string) => api.get<Team>(`/api/v1/user/teams/${id}/`),
};
