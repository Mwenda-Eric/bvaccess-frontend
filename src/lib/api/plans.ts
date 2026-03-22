import {
  Plan,
  PlanGroup,
  WifiCode,
  PlanFilters,
  WifiCodeFilters,
  CreatePlanRequest,
  UpdatePlanRequest,
  GenerateWifiCodesRequest,
  GenerateWifiCodesResponse,
  PaginatedResponse,
  PaginationParams,
  OperationResult,
} from '@/types';
import { get, post, postWithResult, putWithResult, delWithResult } from './client';

export const plansApi = {
  getAll: async (filters?: PlanFilters): Promise<Plan[]> => {
    return get<Plan[]>('/admin/plans', filters as Record<string, unknown>);
  },

  getGroups: async (): Promise<PlanGroup[]> => {
    return get<PlanGroup[]>('/admin/plans/groups');
  },

  activateGroup: async (planName: string): Promise<OperationResult> => {
    return putWithResult(`/admin/plans/activate-group/${encodeURIComponent(planName)}`);
  },

  getById: async (id: string): Promise<Plan> => {
    return get<Plan>(`/admin/plans/${id}`);
  },

  create: async (data: CreatePlanRequest): Promise<OperationResult<Plan>> => {
    return postWithResult<Plan>('/admin/plans', data);
  },

  update: async (id: string, data: UpdatePlanRequest): Promise<OperationResult<Plan>> => {
    return putWithResult<Plan>(`/admin/plans/${id}`, data);
  },

  delete: async (id: string): Promise<OperationResult> => {
    return delWithResult(`/admin/plans/${id}`);
  },
};

export const wifiCodesApi = {
  getList: async (
    params?: PaginationParams & WifiCodeFilters
  ): Promise<PaginatedResponse<WifiCode>> => {
    return get<PaginatedResponse<WifiCode>>('/admin/wifi-codes', params as Record<string, unknown>);
  },

  generate: async (data: GenerateWifiCodesRequest): Promise<OperationResult<GenerateWifiCodesResponse>> => {
    return postWithResult<GenerateWifiCodesResponse>('/admin/wifi-codes/generate', data);
  },

  assign: async (id: string, operatorId?: string): Promise<OperationResult<WifiCode>> => {
    return putWithResult<WifiCode>(`/admin/wifi-codes/${id}/assign`, { operatorId });
  },

  delete: async (id: string): Promise<OperationResult> => {
    return delWithResult(`/admin/wifi-codes/${id}`);
  },
};
