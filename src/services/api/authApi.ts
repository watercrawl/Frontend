import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import { Profile } from '../../types/user';

export const authApi = {
  login(request: LoginRequest): Promise<AuthResponse> {
    return api.post('/api/v1/user/auth/login/', request).then(({ data }) => data);
  },

  register(request: RegisterRequest): Promise<void> {
    return api.post('/api/v1/user/auth/register/', request);
  },

  verifyEmail(token: string): Promise<AuthResponse> {
    return api.get(`/api/v1/user/auth/verify-email/${token}/`).then(({ data }) => data);
  },

  getProfile(): Promise<Profile> {
    return api.get<Profile>(
      '/api/v1/user/profile/'
    ).then(({ data }) => data);
  },

  forgotPassword(email: string): Promise<void> {
    return api.post('/api/v1/user/auth/forgot-password/', { email });
  },

  validateResetToken(token: string): Promise<void> {
    return api.get(`/api/v1/user/auth/reset-password/${token}/`).then(({ data }) => data);
  },

  resetPassword(token: string, password: string): Promise<void> {
    return api.post(`/api/v1/user/auth/reset-password/${token}/`, { password });
  },
};

export default authApi;
