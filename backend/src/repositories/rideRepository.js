import { supabase } from '../config/database.js';

export const createRideRequest = async (rideData) => {
  const { data, error } = await supabase
    .from('ride_requests')
    .insert([{
      ...rideData,
      // ST_MakePoint takes (longitude, latitude)
      pickup_location: `SRID=4326;POINT(${rideData.pickup_lng} ${rideData.pickup_lat})`,
      destination_location: `SRID=4326;POINT(${rideData.destination_lng} ${rideData.destination_lat})`
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRideById = async (id, commuterId) => {
  const { data, error } = await supabase
    .from('ride_requests')
    .select(`
      *,
      assigned_driver:drivers(
        id, is_online, current_location, vehicle_id, profile:profiles(name, phone),
        vehicle:vehicles(vehicle_number, vehicle_type, model)
      )
    `)
    .eq('id', id)
    .eq('commuter_id', commuterId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getRideHistory = async (commuterId) => {
  const { data, error } = await supabase
    .from('ride_requests')
    .select('*')
    .eq('commuter_id', commuterId)
    .order('requested_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateRideStatus = async (id, commuterId, status) => {
  const { data, error } = await supabase
    .from('ride_requests')
    .update({ status })
    .eq('id', id)
    .eq('commuter_id', commuterId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
