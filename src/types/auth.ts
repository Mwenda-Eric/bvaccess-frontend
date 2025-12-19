// Authentication Types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export type AdminRole = 'SuperAdmin' | 'Admin' | 'Viewer';

export interface LoginResponse {
  admin: Admin;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateAdminRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: AdminRole;
}

export interface UpdateAdminRequest {
  username?: string;
  email?: string;
  fullName?: string;
  role?: AdminRole;
  isActive?: boolean;
}

// NextAuth type augmentations are defined in lib/auth.ts
