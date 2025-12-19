// Operator Types

import { Location } from './location';

export interface Operator {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  locationId?: string;
  location?: Location;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OperatorWithStats extends Operator {
  stats: OperatorStats;
}

export interface OperatorStats {
  totalSales: number;
  totalRevenue: number;
  salesToday: number;
  revenueToday: number;
  salesThisWeek: number;
  revenueThisWeek: number;
  salesThisMonth: number;
  revenueThisMonth: number;
  averageTicket: number;
}

export interface OperatorFilters {
  locationId?: string;
  isActive?: boolean;
  search?: string;
}

export interface CreateOperatorRequest {
  username: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  locationId?: string;
  password: string;
}

export interface UpdateOperatorRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  locationId?: string;
  isActive?: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface OperatorPerformance {
  operatorId: string;
  operatorName: string;
  rank: number;
  salesCount: number;
  revenue: number;
  averageTicket: number;
  percentageOfTotal: number;
}

export interface OperatorDailySales {
  date: string;
  salesCount: number;
  revenue: number;
}
