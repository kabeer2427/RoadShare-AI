import { supabase } from '../config/database.js';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';
import * as profileRepo from '../repositories/profileRepository.js';

export const registerUser = async (userData) => {
  // Use a transient client for auth to prevent mutating the global service_role client's session
  const transientSupabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await transientSupabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        role: userData.role
      }
    }
  });

  if (authError) {
    const error = new Error(authError.message);
    error.statusCode = authError.status || 400;
    throw error;
  }

  // 2. Create Profile in our public schema using the global service_role client
  const profilePayload = {
    id: authData.user.id,
    name: userData.name,
    phone: userData.phone,
    email: userData.email,
    role: userData.role,
  };

  const profile = await profileRepo.createProfile(profilePayload);

  // 3. If driver, create vehicle and driver records
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

  // Return session info (if email confirmation is off, session exists)
  return {
    user: profile,
    session: authData.session
  };
};

export const loginUser = async ({ email, password }) => {
  const transientSupabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data: authData, error: authError } = await transientSupabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    const error = new Error(authError.message);
    error.statusCode = 401;
    throw error;
  }

  // Fetch the custom profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) {
    const error = new Error('Profile not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    user: profile,
    session: authData.session
  };
};

export const logoutUser = async (token) => {
  // To sign out globally if needed, though usually just dropping the token client-side is enough for stateless APIs
  // If we had the user's specific JWT, we could call admin.signOut(jwt)
  return { success: true };
};

export const requestPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
};

export const resetPassword = async (email, token, newPassword) => {
  // Verify OTP and set new password in one step using supabase auth verifyOtp
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
  
  if (error) return { error };
  
  // If verification is successful, we can update the user's password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  return { error: updateError };
};
