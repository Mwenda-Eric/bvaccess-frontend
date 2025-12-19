import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  code: z
    .string()
    .min(1, 'Code is required')
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code must be at most 10 characters')
    .regex(/^[A-Z0-9_-]+$/, 'Code can only contain uppercase letters, numbers, hyphens, and underscores'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Address must be at most 200 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateLocationFormData = z.infer<typeof createLocationSchema>;

export const updateLocationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .optional(),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code must be at most 10 characters')
    .regex(/^[A-Z0-9_-]+$/, 'Code can only contain uppercase letters, numbers, hyphens, and underscores')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Address must be at most 200 characters')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
});

export type UpdateLocationFormData = z.infer<typeof updateLocationSchema>;
