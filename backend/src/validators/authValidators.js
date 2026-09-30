import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['commuter', 'driver', 'admin']).default('commuter'),
  // Driver specific optional fields
  license_number: z.string().optional(),
  vehicle_number: z.string().optional(),
  vehicle_type: z.enum(['e_rickshaw', 'auto', 'shared_auto', 'taxi']).optional(),
  vehicle_capacity: z.number().int().positive().optional(),
}).refine(data => {
  if (data.role === 'driver') {
    return data.license_number && data.vehicle_number && data.vehicle_type && data.vehicle_capacity;
  }
  return true;
}, {
  message: 'Driver registration requires license_number, vehicle_number, vehicle_type, and vehicle_capacity'
});

export const loginSchema = z.object({
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
