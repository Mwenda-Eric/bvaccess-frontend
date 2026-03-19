// Plan & WiFi Code Types

export interface Plan {
  id: string;
  planName: string;
  name: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WifiCode {
  id: string;
  code: string;
  planId: string;
  planName: string;
  planTierName: string;
  price: number;
  durationMinutes: number;
  isUsed: boolean;
  usedAt: string | null;
  assignedToOperatorId: string | null;
  operatorName: string | null;
  createdAt: string;
}

export interface PlanFilters {
  planName?: string;
  isActive?: boolean;
}

export interface WifiCodeFilters {
  planId?: string;
  isUsed?: boolean;
  search?: string;
}

export interface CreatePlanRequest {
  planName: string;
  name: string;
  durationMinutes: number;
  price: number;
  sortOrder: number;
}

export interface UpdatePlanRequest {
  planName: string;
  name: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export interface GenerateWifiCodesRequest {
  planId: string;
  count: number;
}

export interface GenerateWifiCodesResponse {
  generatedCount: number;
  planTierName: string;
}
