import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError, OperationResult } from '@/types';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Convert PascalCase keys to camelCase (for .NET backend compatibility)
 */
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function convertKeysToCamelCase<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item)) as T;
  }

  if (typeof obj === 'object' && obj !== null) {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      converted[camelKey] = convertKeysToCamelCase(value);
    }
    return converted as T;
  }

  return obj as T;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from NextAuth session
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and convert PascalCase to camelCase
apiClient.interceptors.response.use(
  (response) => {
    // Convert PascalCase keys to camelCase for .NET backend compatibility
    if (response.data) {
      response.data = convertKeysToCamelCase(response.data);
    }

    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response (converted to camelCase):`, response.data);
    }
    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      // Sign out and redirect to login
      await signOut({ redirect: true, callbackUrl: '/login' });
      return Promise.reject(error);
    }

    // Extract error from response
    const responseData = error.response?.data;

    // Log full error response in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] Full Error Response:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        requestData: error.config?.data,
        url: error.config?.url,
      });
    }

    // Handle API error format - check multiple possible error locations
    // Cast to any for flexibility with different backend error formats
    const errorData = responseData as Record<string, unknown> | undefined;
    const apiError: ApiError = responseData?.error || {
      code: `HTTP_${error.response?.status || 'UNKNOWN'}`,
      message: (errorData?.message || errorData?.title || error.message || 'An unexpected error occurred') as string,
      details: errorData?.errors ? Object.entries(errorData.errors as Record<string, string[]>).map(([field, messages]) => ({
        field,
        message: Array.isArray(messages) ? messages.join(', ') : String(messages),
      })) : [],
    };

    // Log formatted error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] Formatted Error:`, {
        error: apiError,
        traceId: responseData?.traceId,
      });
    }

    return Promise.reject(apiError);
  }
);

/**
 * GET request - returns data from response
 */
export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });

  if (!response.data.success) {
    throw response.data.error || { code: 'REQUEST_FAILED', message: 'Request failed' };
  }

  // For GET requests, data is required
  if (response.data.data === undefined) {
    throw { code: 'NO_DATA', message: 'No data returned from server' };
  }

  return response.data.data;
}

/**
 * POST request - returns data and message from response
 */
export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);

  if (!response.data.success) {
    throw response.data.error || { code: 'REQUEST_FAILED', message: 'Request failed' };
  }

  // Return data (may be undefined for some operations)
  return response.data.data as T;
}

/**
 * POST request with operation result - returns both data and message
 */
export async function postWithResult<T>(url: string, data?: unknown): Promise<OperationResult<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);

  if (!response.data.success) {
    throw response.data.error || { code: 'REQUEST_FAILED', message: 'Request failed' };
  }

  return {
    success: response.data.success,
    message: response.data.message || 'Operation completed successfully',
    data: response.data.data,
  };
}

/**
 * PUT request - returns data from response
 */
export async function put<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);

  if (!response.data.success) {
    throw response.data.error || { code: 'REQUEST_FAILED', message: 'Request failed' };
  }

  return response.data.data as T;
}

/**
 * PUT request with operation result - returns both data and message
 */
export async function putWithResult<T>(url: string, data?: unknown): Promise<OperationResult<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);

  if (!response.data.success) {
    throw response.data.error || { code: 'REQUEST_FAILED', message: 'Request failed' };
  }

  return {
    success: response.data.success,
    message: response.data.message || 'Operation completed successfully',
    data: response.data.data,
  };
}

/**
 * PATCH request - returns data from response
 */
export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);

  if (!response.data.success) {
    throw response.data.error || { code: 'REQUEST_FAILED', message: 'Request failed' };
  }

  return response.data.data as T;
}

/**
 * DELETE request - returns success status
 */
export async function del<T = void>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url);

  if (!response.data.success) {
    throw response.data.error || { code: 'DELETE_FAILED', message: 'Delete operation failed' };
  }

  return response.data.data as T;
}

/**
 * DELETE request with operation result - returns message
 */
export async function delWithResult(url: string): Promise<OperationResult> {
  const response = await apiClient.delete<ApiResponse<unknown>>(url);

  if (!response.data.success) {
    throw response.data.error || { code: 'DELETE_FAILED', message: 'Delete operation failed' };
  }

  return {
    success: response.data.success,
    message: response.data.message || 'Deleted successfully',
    data: response.data.data,
  };
}

/**
 * Download file helper
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * Format API error for display
 */
export function formatApiError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  const apiError = error as ApiError;

  if (apiError?.details && apiError.details.length > 0) {
    // Return field-specific errors
    return apiError.details.map(d => `${d.field}: ${d.message}`).join(', ');
  }

  return apiError?.message || 'An unexpected error occurred';
}

export default apiClient;
