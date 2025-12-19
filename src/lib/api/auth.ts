import axios from 'axios';
import {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  Admin,
  CreateAdminRequest,
  UpdateAdminRequest,
  ChangePasswordRequest,
} from '@/types';
import { get, post, put, del } from './client';
import { PaginatedResponse, PaginationParams } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Auth endpoints - these don't use the authenticated client
export const authApi = {
  // Login - called directly without auth token
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, credentials);
    if (!response.data.success || !response.data.data) {
      throw response.data.error || { code: 'LOGIN_FAILED', message: 'Login failed' };
    }
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    if (!response.data.success || !response.data.data) {
      throw response.data.error || { code: 'REFRESH_FAILED', message: 'Token refresh failed' };
    }
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await post('/auth/logout', {});
  },

  // Get current admin profile
  getProfile: async (): Promise<Admin> => {
    return get<Admin>('/auth/profile');
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await post('/auth/change-password', data);
  },
};

// Admin management endpoints (SuperAdmin only)
export const adminsApi = {
  // Get all admins (returns array, not paginated)
  getAll: async (): Promise<Admin[]> => {
    return get<Admin[]>('/admin/admins');
  },

  // Get admin by ID
  getById: async (id: string): Promise<Admin> => {
    return get<Admin>(`/admin/admins/${id}`);
  },

  // Create admin
  create: async (data: CreateAdminRequest): Promise<Admin> => {
    return post<Admin>('/admin/admins', data);
  },

  // Update admin
  update: async (id: string, data: UpdateAdminRequest): Promise<Admin> => {
    return put<Admin>(`/admin/admins/${id}`, data);
  },

  // Delete admin
  delete: async (id: string): Promise<void> => {
    await del(`/admin/admins/${id}`);
  },

  // Toggle admin status (activate/deactivate via update)
  toggleStatus: async (id: string, isActive: boolean): Promise<Admin> => {
    return put<Admin>(`/admin/admins/${id}`, { isActive });
  },

  // Reset admin password (SuperAdmin only)
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await put(`/admin/admins/${id}/reset-password`, { newPassword });
  },
};
