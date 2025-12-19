import {
  Location,
  LocationWithStats,
  LocationFilters,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationSalesData,
  LocationHourlySales,
  PaginatedResponse,
  PaginationParams,
  OperationResult,
} from '@/types';
import { get, postWithResult, putWithResult, delWithResult } from './client';

export const locationsApi = {
  // Get all locations (returns array, not paginated)
  getAll: async (): Promise<Location[]> => {
    return get<Location[]>('/admin/locations');
  },

  // Get locations list with pagination (simulated from array)
  getList: async (
    params?: PaginationParams & LocationFilters
  ): Promise<PaginatedResponse<Location>> => {
    const allLocations = await get<Location[]>('/admin/locations');

    // Apply filtering
    let filtered = allLocations;
    if (params?.isActive !== undefined) {
      filtered = filtered.filter(loc => loc.isActive === params.isActive);
    }
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(search) ||
        loc.code.toLowerCase().includes(search) ||
        loc.description?.toLowerCase().includes(search)
      );
    }

    // Apply pagination
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 100; // Default to larger page for locations
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

  // Get single location by ID
  getById: async (id: string): Promise<Location> => {
    return get<Location>(`/admin/locations/${id}`);
  },

  // Get location with stats
  getStats: async (id: string): Promise<LocationWithStats> => {
    return get<LocationWithStats>(`/admin/locations/${id}/stats`);
  },

  // Create location
  create: async (data: CreateLocationRequest): Promise<OperationResult<Location>> => {
    return postWithResult<Location>('/admin/locations', data);
  },

  // Update location
  update: async (id: string, data: UpdateLocationRequest): Promise<OperationResult<Location>> => {
    return putWithResult<Location>(`/admin/locations/${id}`, data);
  },

  // Delete location (SuperAdmin only - soft delete)
  delete: async (id: string): Promise<OperationResult> => {
    return delWithResult(`/admin/locations/${id}`);
  },

  // Toggle location status (activate/deactivate via update)
  toggleStatus: async (id: string, isActive: boolean): Promise<OperationResult<Location>> => {
    return putWithResult<Location>(`/admin/locations/${id}`, { isActive });
  },
};
