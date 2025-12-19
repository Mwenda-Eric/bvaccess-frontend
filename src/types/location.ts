// Location Types

export interface Location {
  id: string;
  name: string;
  code: string;
  description?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LocationWithStats extends Location {
  stats: LocationStats;
}

export interface LocationStats {
  totalSales: number;
  totalRevenue: number;
  salesToday: number;
  revenueToday: number;
  salesThisWeek: number;
  revenueThisWeek: number;
  salesThisMonth: number;
  revenueThisMonth: number;
  operatorCount: number;
  activeOperatorCount: number;
}

export interface LocationFilters {
  isActive?: boolean;
  search?: string;
}

export interface CreateLocationRequest {
  name: string;
  code?: string;
  description?: string;
  address?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  code?: string;
  description?: string;
  address?: string;
  isActive?: boolean;
}

export interface LocationSalesData {
  locationId: string;
  locationName: string;
  salesCount: number;
  revenue: number;
  percentageOfTotal: number;
}

export interface LocationHourlySales {
  hour: number;
  salesCount: number;
  revenue: number;
}
