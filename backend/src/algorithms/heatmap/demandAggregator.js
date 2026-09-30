import { supabase } from '../../config/database.js';

export const getAggregatedDemand = async () => {
  const { data, error } = await supabase
    .from('ride_requests')
    .select('pickup_lat, pickup_lng, passenger_count, status')
    .in('status', ['pending', 'clustered']);

  if (error) throw error;

  // Simple clustering algorithm
  const zones = [];
  const radius = 0.02; // Roughly 2km

  data.forEach(req => {
    let matchedZone = null;
    for (let zone of zones) {
      const dLat = zone.lat - req.pickup_lat;
      const dLng = zone.lng - req.pickup_lng;
      if (Math.sqrt(dLat * dLat + dLng * dLng) < radius) {
        matchedZone = zone;
        break;
      }
    }

    if (matchedZone) {
      matchedZone.requests += 1;
      // Re-calculate center
      matchedZone.lat = (matchedZone.lat * (matchedZone.requests - 1) + req.pickup_lat) / matchedZone.requests;
      matchedZone.lng = (matchedZone.lng * (matchedZone.requests - 1) + req.pickup_lng) / matchedZone.requests;
    } else {
      zones.push({
        name: `Zone ${String.fromCharCode(65 + zones.length)}`, // Zone A, Zone B...
        lat: req.pickup_lat,
        lng: req.pickup_lng,
        requests: 1
      });
    }
  });

  // Calculate multipliers based on request count (e.g. 1 + (requests / 10))
  zones.forEach(zone => {
    zone.multiplier = parseFloat((1.0 + (zone.requests * 0.1)).toFixed(1));
  });

  // Sort by highest demand
  zones.sort((a, b) => b.requests - a.requests);

  return zones.slice(0, 5); // Return top 5 zones
};
