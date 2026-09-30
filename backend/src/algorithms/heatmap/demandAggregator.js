import { supabase } from '../../config/database.js';

export const getAggregatedDemand = async () => {
  // A naive implementation to get pending and in_progress rides
  // In a real system, you'd aggregate geographically using PostGIS grid (e.g. ST_SnapToGrid)
  const { data, error } = await supabase
    .from('ride_requests')
    .select('pickup_lat, pickup_lng, passenger_count, status')
    .in('status', ['pending', 'clustered']);

  if (error) throw error;

  // Manual simple aggregation (clustering points within a certain radius)
  // For MVP, just returning raw points works if frontend uses Leaflet heatlayer
  return data;
};
