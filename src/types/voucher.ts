// Voucher Types

// Backend returns flat data, not nested objects
export interface Voucher {
  id: string;
  code: string;
  durationMinutes: number;
  bandwidth: BandwidthType;
  paymentMethod: PaymentMethod;
  price: number;
  buyerInfo?: string;
  // Backend returns flat location data
  locationId: string;
  locationName: string;
  // Backend returns flat operator data
  operatorId: string;
  operatorName: string;
  createdAt: string;
  expiresAt: string;
  isVoid: boolean;
  voidedAt?: string;
  voidedById?: string;
  voidedByName?: string;
  voidReason?: string;
}

export type BandwidthType = 'Unlimited' | 'Limited';

export type PaymentMethod = 'Cash' | 'EWallet';

export type VoucherStatus = 'active' | 'void' | 'expired';

export interface VoucherFilters {
  locationIds?: string[];
  operatorIds?: string[];
  status?: VoucherStatus;
  paymentMethod?: PaymentMethod;
  dateFrom?: string;
  dateTo?: string;
  durationMinutes?: number;
  search?: string;
}

export interface CreateVoucherRequest {
  durationMinutes: number;
  bandwidth: BandwidthType;
  paymentMethod: PaymentMethod;
  locationId: string;
  buyerInfo?: string;
  customPrice?: number;
}

export interface VoidVoucherRequest {
  reason: string;
}

export interface VoucherSummary {
  totalCount: number;
  activeCount: number;
  voidedCount: number;
  expiredCount: number;
  totalRevenue: number;
  voidedRevenue: number;
}

export interface DurationOption {
  minutes: number;
  label: string;
  price: number;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { minutes: 30, label: '30 minutes', price: 25 },
  { minutes: 60, label: '1 hour', price: 50 },
  { minutes: 120, label: '2 hours', price: 75 },
  { minutes: 1440, label: '24 hours', price: 150 },
];

export function getVoucherStatus(voucher: Voucher): VoucherStatus {
  if (voucher.isVoid) return 'void';
  if (new Date(voucher.expiresAt) < new Date()) return 'expired';
  return 'active';
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${minutes / 60} hr${minutes > 60 ? 's' : ''}`;
  return `${minutes / 1440} day${minutes > 1440 ? 's' : ''}`;
}
