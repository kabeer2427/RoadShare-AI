import { supabase } from '../config/database.js';

export const findProfileByPhone = async (phone) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
};

export const createProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const createDriver = async (driverData, vehicleData) => {
  // Use a transaction/RPC if possible, but for MVP we do sequentially
  // 1. Create vehicle
  const { data: vehicle, error: vehicleErr } = await supabase
    .from('vehicles')
    .insert([vehicleData])
    .select()
    .single();
  if (vehicleErr) throw vehicleErr;

  // 2. Create driver
  driverData.vehicle_id = vehicle.id;
  const { data: driver, error: driverErr } = await supabase
    .from('drivers')
    .insert([driverData])
    .select()
    .single();
  if (driverErr) throw driverErr;

  return { driver, vehicle };
};
