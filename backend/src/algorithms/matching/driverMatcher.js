import { supabase } from '../../config/database.js';
import { calculateDistance } from '../../utils/geoUtils.js';

export const assignDriversToClusters = async (clusters) => {
  const assignments = [];

  for (const cluster of clusters) {
    const firstPickup = cluster.requests[0];
    
    // Find nearby drivers via RPC
    const { data: drivers, error } = await supabase.rpc('find_nearby_drivers', {
      lat: firstPickup.pickup_lat,
      lng: firstPickup.pickup_lng,
      radius: 3000
    });

    if (error || !drivers || drivers.length === 0) {
      // Keep as pending or clustered but unassigned
      continue;
    }

    // Filter available drivers (not currently on an active route, or has capacity)
    // For MVP, just take the first available driver (closest)
    const selectedDriver = drivers[0];

    // Create assignments in DB
    // 1. Create cluster
    const { data: dbCluster, error: clusterErr } = await supabase
      .from('ride_clusters')
      .insert([{
        cluster_center: `SRID=4326;POINT(${firstPickup.pickup_lng} ${firstPickup.pickup_lat})`,
        request_count: cluster.requests.length,
        status: 'matched'
      }])
      .select()
      .single();

    if (clusterErr) continue;

    // 2. Link requests
    const members = cluster.requests.map(r => ({
      cluster_id: dbCluster.id,
      ride_request_id: r.id
    }));
    await supabase.from('cluster_members').insert(members);

    // 3. Update request status
    const requestIds = cluster.requests.map(r => r.id);
    await supabase
      .from('ride_requests')
      .update({ status: 'matched', cluster_id: dbCluster.id, assigned_driver_id: selectedDriver.id })
      .in('id', requestIds);

    // 4. Create driver_route
    await supabase.from('driver_routes').insert([{
      driver_id: selectedDriver.id,
      cluster_id: dbCluster.id,
      route_geometry: cluster.route.sequence,
      estimated_distance: cluster.route.distance,
      detour_distance: cluster.route.detourPercent,
      status: 'active'
    }]);

    assignments.push({ clusterId: dbCluster.id, driverId: selectedDriver.id });
  }

  return assignments;
};
