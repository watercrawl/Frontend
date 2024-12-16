import { AxiosResponse } from 'axios';
import api from './api';
import { AuthResponse, LoginCredentials, Profile, RegisterCredentials } from '../../types/user';


export const authApi = {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>(
      '/api/v1/user/auth/login/', 
      credentials
    ).then(({ data }) => data);
  },

  register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse, AxiosResponse<AuthResponse>, RegisterCredentials>(
      '/api/v1/user/auth/register/', 
      credentials,
    ).then(({ data }) => data);
  },


  getProfile(): Promise<Profile> {
    return api.get<Profile>(
      '/api/v1/user/profile/'
    ).then(({ data }) => data);
  },
};

export default authApi;
