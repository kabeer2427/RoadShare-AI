import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV if needed, defaults to .env in root or backend
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-for-dev',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  geminiApiKey: process.env.GEMINI_API_KEY,
  matching: {
    maxClusterRadius: process.env.MAX_CLUSTER_RADIUS || 2000, // meters
    maxWaitDifference: process.env.MAX_WAIT_DIFFERENCE || 5 * 60, // seconds
    maxDetourPercent: process.env.MAX_DETOUR_PERCENT || 20, // percentage
    driverSearchRadius: process.env.DRIVER_SEARCH_RADIUS || 3000, // meters
    weights: {
      pickupProximity: 0.30,
      destinationSimilarity: 0.25,
      routeAlignment: 0.20,
      driverProximity: 0.15,
      timeCompatibility: 0.10,
    }
  }
};
