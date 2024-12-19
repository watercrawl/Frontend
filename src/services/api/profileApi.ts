import api from './api';

export interface Profile {
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
}

export interface Team {
  uuid: string;
  name: string;
}

export interface Invitation {
  uuid: string;
  team: Team;
  created_at: string;
}

export const profileApi = {
  getProfile(): Promise<Profile> {
    return api.get<Profile>('/api/v1/user/profile/').then(({ data }) => data);
  },

  updateProfile(data: UpdateProfileRequest): Promise<Profile> {
    return api.patch<Profile>('/api/v1/user/profile/', data).then(({ data }) => data);
  },

  getInvitations(): Promise<Invitation[]> {
    return api.get<Invitation[]>('/api/v1/user/profile/invitations/').then(({ data }) => data);
  },

  acceptInvitation(uuid: string): Promise<void> {
    return api.post(`/api/v1/user/profile/invitations/${uuid}/accept/`);
  },
};
