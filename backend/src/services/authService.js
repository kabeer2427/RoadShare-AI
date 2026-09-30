import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import * as profileRepo from '../repositories/profileRepository.js';

export const registerUser = async (userData) => {
  // Check if user exists
  const existingUser = await profileRepo.findProfileByPhone(userData.phone);
  if (existingUser) {
    const error = new Error('User with this phone number already exists');
    error.statusCode = 409;
    error.code = 'CONFLICT';
    throw error;
  }

  // Hash password
  const password_hash = await bcrypt.hash(userData.password, config.bcryptRounds);

  // Create Profile
  const profilePayload = {
    name: userData.name,
    phone: userData.phone,
    email: userData.email,
    password_hash,
    role: userData.role,
  };

  const profile = await profileRepo.createProfile(profilePayload);

  // If driver, create vehicle and driver records
  if (userData.role === 'driver') {
    const vehiclePayload = {
      driver_id: profile.id,
      vehicle_number: userData.vehicle_number,
      vehicle_type: userData.vehicle_type,
      capacity: userData.vehicle_capacity,
    };
    const driverPayload = {
      profile_id: profile.id,
      license_number: userData.license_number,
      capacity: userData.vehicle_capacity,
    };
    await profileRepo.createDriver(driverPayload, vehiclePayload);
  }

  return generateSession(profile);
};

export const loginUser = async ({ phone, password }) => {
  const profile = await profileRepo.findProfileByPhone(phone);
  if (!profile) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, profile.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  return generateSession(profile);
};

const generateSession = (profile) => {
  const payload = {
    id: profile.id,
    role: profile.role,
    sub: profile.id // required for our custom Supabase RLS policies
  };
  
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
  
  const { password_hash, ...safeProfile } = profile;
  return { user: safeProfile, token };
};
