import {
  Operator,
  OperatorWithStats,
  OperatorFilters,
  CreateOperatorRequest,
  UpdateOperatorRequest,
  OperatorPerformance,
  OperatorDailySales,
  PaginatedResponse,
  PaginationParams,
  OperationResult,
} from '@/types';
import { get, postWithResult, putWithResult } from './client';

export const operatorsApi = {
  // Get all operators (returns array, not paginated)
  getAll: async (): Promise<Operator[]> => {
    return get<Operator[]>('/admin/operators');
  },

  // Get operators list with pagination (simulated from array)
  getList: async (
    params?: PaginationParams & OperatorFilters
  ): Promise<PaginatedResponse<Operator>> => {
    const allOperators = await get<Operator[]>('/admin/operators');

    // Apply filtering
    let filtered = allOperators;
    if (params?.locationId) {
      filtered = filtered.filter(op => op.locationId === params.locationId);
    }
    if (params?.isActive !== undefined) {
      filtered = filtered.filter(op => op.isActive === params.isActive);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(op =>
        op.fullName.toLowerCase().includes(search) ||
        op.username.toLowerCase().includes(search) ||
        op.email?.toLowerCase().includes(search)
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  },

  // Get single operator by ID
  getById: async (id: string): Promise<Operator> => {
    return get<Operator>(`/admin/operators/${id}`);
  },

  // Get operator activity (stats)
  getActivity: async (id: string, days: number = 30): Promise<OperatorDailySales[]> => {
    return get<OperatorDailySales[]>(`/admin/operators/${id}/activity`, { days });
  },

  // Create operator
  create: async (data: CreateOperatorRequest): Promise<OperationResult<Operator>> => {
    // Log the request data for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('[Operators API] Creating operator with data:', data);
    }

    // Transform to match backend expectations
    // Try PascalCase format for .NET backend compatibility
    const requestData = {
      Username: data.username,
      FullName: data.fullName,
      Password: data.password,
      Email: data.email || null,
      PhoneNumber: data.phoneNumber || null,
      LocationId: data.locationId || null,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Operators API] Transformed request data (PascalCase):', requestData);
    }

    return postWithResult<Operator>('/admin/operators', requestData);
  },

  // Update operator
  update: async (id: string, data: UpdateOperatorRequest): Promise<OperationResult<Operator>> => {
    // Transform to PascalCase for .NET backend
    const requestData: Record<string, unknown> = {};
    if (data.fullName !== undefined) requestData.FullName = data.fullName;
    if (data.email !== undefined) requestData.Email = data.email || null;
    if (data.phoneNumber !== undefined) requestData.PhoneNumber = data.phoneNumber || null;
    if (data.locationId !== undefined) requestData.LocationId = data.locationId || null;
    if (data.isActive !== undefined) requestData.IsActive = data.isActive;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Operators API] Updating operator with data (PascalCase):', requestData);
    }

    return putWithResult<Operator>(`/admin/operators/${id}`, requestData);
  },

  // Delete operator (not available in backend - operators are deactivated instead)
  delete: async (id: string): Promise<OperationResult> => {
    // Deactivate instead of delete
    return putWithResult(`/admin/operators/${id}/status`, { isActive: false });
  },

  // Toggle operator status (activate/deactivate)
  toggleStatus: async (id: string, isActive: boolean): Promise<OperationResult> => {
    return putWithResult(`/admin/operators/${id}/status`, { isActive });
  },

  // Reset operator password (SuperAdmin only)
  resetPassword: async (id: string, newPassword: string): Promise<OperationResult> => {
    return putWithResult(`/admin/operators/${id}/reset-password`, { newPassword });
  },

  // Get operator daily sales history (alias for activity)
  getDailySales: async (id: string, days: number = 30): Promise<OperatorDailySales[]> => {
    return get<OperatorDailySales[]>(`/admin/operators/${id}/activity`, { days });
  },
};
