import { z } from 'zod';

export const voidVoucherSchema = z.object({
  reason: z
    .string()
    .min(1, 'Reason is required')
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be at most 500 characters'),
});

export type VoidVoucherFormData = z.infer<typeof voidVoucherSchema>;

export const voucherFilterSchema = z.object({
  locationIds: z.array(z.string()).optional(),
  operatorIds: z.array(z.string()).optional(),
  status: z.enum(['active', 'void', 'expired']).optional(),
  paymentMethod: z.enum(['Cash', 'EWallet']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  durationMinutes: z.number().optional(),
  search: z.string().optional(),
});

export type VoucherFilterFormData = z.infer<typeof voucherFilterSchema>;
