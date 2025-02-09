import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import { Profile } from '../../types/user';

export const authApi = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    return api.post('/api/v1/user/auth/login/', request).then(({ data }) => data);
  },

  async register(request: RegisterRequest): Promise<void> {
    return api.post('/api/v1/user/auth/register/', request);
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    return api.get(`/api/v1/user/auth/verify-email/${token}/`).then(({ data }) => data);
  },

  async getProfile(): Promise<Profile> {
    return api.get<Profile>(
      '/api/v1/user/profile/'
    ).then(({ data }) => data);
  },

  async forgotPassword(email: string): Promise<void> {
    return api.post('/api/v1/user/auth/forgot-password/', { email });
  },

  async validateResetToken(token: string): Promise<void> {
    return api.get(`/api/v1/user/auth/reset-password/${token}/`).then(({ data }) => data);
  },

  async resetPassword(token: string, password: string): Promise<void> {
    return api.post(`/api/v1/user/auth/reset-password/${token}/`, { password });
  },

  async resendVerificationEmail(email: string): Promise<void> {
    return api.post('/api/v1/user/auth/resend-verify-email/', { email });
  },
};

export default authApi;
