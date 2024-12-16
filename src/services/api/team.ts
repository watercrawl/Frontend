import { PaginatedResponse } from '../../types/common';
import { Team, TeamMember } from '../../types/team';
import api from './api';


export const teamService = {
  async getCurrentTeam(): Promise<Team> {
    const { data } = await api.get<Team>('/api/v1/user/teams/current/');
    return data;
  },

  async updateTeamName(name: string): Promise<Team> {
    const { data } = await api.patch<Team>('/api/v1/user/teams/current/', { name });
    return data;
  },

  async inviteMember(email: string, _newMemberRole: boolean): Promise<void> {
    await api.post('/api/v1/user/teams/current/invite/', { email });
  },

  async listMembers(page: number = 1): Promise<PaginatedResponse<TeamMember>> {
    const { data } = await api.get<PaginatedResponse<TeamMember>>('/api/v1/user/teams/current/members/', {
      params: { page },
    });
    return data;
  },

  async removeMember(memberId: string): Promise<void> {
    await api.delete(`/api/v1/user/teams/current/members/${memberId}/`);
  },
};
