import { config } from '../config/env.js';

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
};

export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const y = Math.sin(lon2-lon1) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  const θ = Math.atan2(y, x);
  const brng = (θ*180/Math.PI + 360) % 360; // in degrees
  return brng;
};

export const calculateDirectionSimilarity = (brng1, brng2) => {
  let diff = Math.abs(brng1 - brng2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  // 0 diff -> 1 score, 180 diff -> 0 score
  return 1 - (diff / 180);
};

export const calculateCompatibility = (reqA, reqB) => {
  const pickupDistance = calculateDistance(reqA.pickup_lat, reqA.pickup_lng, reqB.pickup_lat, reqB.pickup_lng);
  if (pickupDistance > config.matching.maxClusterRadius) return 0;
  
  const bearingA = calculateBearing(reqA.pickup_lat, reqA.pickup_lng, reqA.destination_lat, reqA.destination_lng);
  const bearingB = calculateBearing(reqB.pickup_lat, reqB.pickup_lng, reqB.destination_lat, reqB.destination_lng);
  
  const directionScore = calculateDirectionSimilarity(bearingA, bearingB);
  
  // Normalize pickup distance to a score (0 to 1) where closer is closer to 1
  const pickupScore = Math.max(0, 1 - (pickupDistance / config.matching.maxClusterRadius));
  
  // A simple heuristic for destination similarity using distance
  const destDistance = calculateDistance(reqA.destination_lat, reqA.destination_lng, reqB.destination_lat, reqB.destination_lng);
  const destScore = Math.max(0, 1 - (destDistance / (config.matching.maxClusterRadius * 2)));

  const waitDiffSecs = Math.abs(new Date(reqA.requested_at).getTime() - new Date(reqB.requested_at).getTime()) / 1000;
  if (waitDiffSecs > config.matching.maxWaitDifference) return 0;
  
  const timeScore = Math.max(0, 1 - (waitDiffSecs / config.matching.maxWaitDifference));

  const totalScore = (
    config.matching.weights.pickupProximity * pickupScore +
    config.matching.weights.destinationSimilarity * destScore +
    config.matching.weights.routeAlignment * directionScore +
    config.matching.weights.timeCompatibility * timeScore
  );
  
  return totalScore; // 0 to something near 0.85 (since driver driverProximity is missing)
};
