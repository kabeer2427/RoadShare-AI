import { z } from 'zod';

export const createRideSchema = z.object({
  pickup_lat: z.number().min(-90).max(90),
  pickup_lng: z.number().min(-180).max(180),
  destination_lat: z.number().min(-90).max(90),
  destination_lng: z.number().min(-180).max(180),
  passenger_count: z.number().int().min(1).max(10).default(1),
});
