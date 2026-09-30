import { supabase } from '../config/database.js';

export const updateDriverStatus = async (profileId, isOnline) => {
  const { data, error } = await supabase
    .from('drivers')
    .update({ is_online: isOnline })
    .eq('profile_id', profileId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDriverLocation = async (profileId, lat, lng) => {
  const location = `SRID=4326;POINT(${lng} ${lat})`;

  // First get the driver ID
  const { data: driverData, error: driverErr } = await supabase
    .from('drivers')
    .select('id')
    .eq('profile_id', profileId)
    .single();

  if (driverErr) throw driverErr;

  const { data, error } = await supabase
    .from('drivers')
    .update({ 
      current_location: location,
      last_location_update: new Date()
    })
    .eq('id', driverData.id)
    .select()
    .single();

  if (error) throw error;

  // Insert location history (throttled in service)
  await supabase
    .from('driver_locations')
    .insert([{ driver_id: driverData.id, location }]);

  return data;
};

export const getDriverByProfileId = async (profileId) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getActiveRoute = async (driverId) => {
  const { data, error } = await supabase
    .from('driver_routes')
    .select('*')
    .eq('driver_id', driverId)
    .eq('status', 'active')
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getNearbyDrivers = async (lat, lng, radiusMeters) => {
  const location = `SRID=4326;POINT(${lng} ${lat})`;
  
  // Custom PostGIS function or RPC might be better here for MVP, or we can use Supabase JS eq/filter if PostGIS is exposed.
  // Using rpc is the standard way to query PostGIS in Supabase if you don't use the db client directly.
  // Let's assume we create an RPC `get_nearby_drivers` or we use raw SQL on backend.
  // Since we are running custom backend, we can query directly using postgrest syntax if we created a view/RPC.
  // We'll throw a NotImplemented error for now, as we need to define the RPC `find_nearby_drivers`.
  
  const { data, error } = await supabase.rpc('find_nearby_drivers', {
    lat: lat,
    lng: lng,
    radius: radiusMeters
  });

  if (error) throw error;
  return data;
};
