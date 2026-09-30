import { supabase } from '../../config/database.js';
import { calculateCompatibility, calculateDistance } from '../../utils/geoUtils.js';
import { config } from '../../config/env.js';
import { findBestRoute } from '../routing/routeOptimizer.js';

export const runClustering = async () => {
  // 1. Get oldest pending requests
  const { data: pendingRequests, error } = await supabase
    .from('ride_requests')
    .select('*')
    .eq('status', 'pending')
    .order('requested_at', { ascending: true })
    .limit(50);
    
  if (error) throw error;
  if (!pendingRequests || pendingRequests.length === 0) return { clusters: [] };

  const clusters = [];
  const processed = new Set();

  for (const anchorReq of pendingRequests) {
    if (processed.has(anchorReq.id)) continue;
    
    // Create a new cluster candidate
    let currentCluster = [anchorReq];
    let currentCapacity = anchorReq.passenger_count;
    processed.add(anchorReq.id);

    // 2. Find nearby requests using PostGIS in a real scenario
    // For MVP in memory, since we limited to 50, we just filter
    const candidates = pendingRequests.filter(r => 
      !processed.has(r.id) && 
      calculateDistance(anchorReq.pickup_lat, anchorReq.pickup_lng, r.pickup_lat, r.pickup_lng) <= config.matching.maxClusterRadius
    );

    // 3. Calculate compatibility
    const scoredCandidates = candidates.map(c => ({
      request: c,
      score: calculateCompatibility(anchorReq, c)
    })).filter(c => c.score > 0.4).sort((a, b) => b.score - a.score);

    // 5. Add candidates while constraints allow
    for (const { request } of scoredCandidates) {
      // Assuming max standard vehicle capacity is 4
      if (currentCapacity + request.passenger_count <= 4) {
        // Evaluate route detour
        const testCluster = [...currentCluster, request];
        const route = findBestRoute(testCluster);
        
        if (route.detourPercent <= config.matching.maxDetourPercent) {
          currentCluster.push(request);
          currentCapacity += request.passenger_count;
          processed.add(request.id);
        }
      }
    }

    clusters.push({
      requests: currentCluster,
      route: findBestRoute(currentCluster)
    });
  }

  return { clusters };
};
