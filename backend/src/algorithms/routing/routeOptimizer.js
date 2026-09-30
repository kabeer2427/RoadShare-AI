import { calculateDistance } from '../../utils/geoUtils.js';

export const findBestRoute = (requests) => {
  // Simple heuristic for MVP:
  // Route: Pickup A -> Pickup B -> ... -> Drop A -> Drop B
  // We'll calculate straight-line distances.
  
  if (requests.length === 1) {
    const r = requests[0];
    const dist = calculateDistance(r.pickup_lat, r.pickup_lng, r.destination_lat, r.destination_lng);
    return {
      sequence: [{ type: 'pickup', reqId: r.id }, { type: 'drop', reqId: r.id }],
      distance: dist,
      detourPercent: 0,
    };
  }

  // Very naive MVP heuristic: Pickups first in order of array, drops in order of array
  // A real TSP solver would evaluate all valid permutations.
  
  let totalDistance = 0;
  
  // Distance from P1 to P2
  totalDistance += calculateDistance(
    requests[0].pickup_lat, requests[0].pickup_lng,
    requests[1].pickup_lat, requests[1].pickup_lng
  );
  
  // Distance from P2 to D1
  totalDistance += calculateDistance(
    requests[1].pickup_lat, requests[1].pickup_lng,
    requests[0].destination_lat, requests[0].destination_lng
  );

  // Distance from D1 to D2
  totalDistance += calculateDistance(
    requests[0].destination_lat, requests[0].destination_lng,
    requests[1].destination_lat, requests[1].destination_lng
  );

  const directA = calculateDistance(requests[0].pickup_lat, requests[0].pickup_lng, requests[0].destination_lat, requests[0].destination_lng);
  const directB = calculateDistance(requests[1].pickup_lat, requests[1].pickup_lng, requests[1].destination_lat, requests[1].destination_lng);

  // Detour for A = totalDistance - directA
  // (In reality, detour for A is just P1 -> P2 -> D1, not D2)
  const distA = calculateDistance(requests[0].pickup_lat, requests[0].pickup_lng, requests[1].pickup_lat, requests[1].pickup_lng) +
                calculateDistance(requests[1].pickup_lat, requests[1].pickup_lng, requests[0].destination_lat, requests[0].destination_lng);
  
  const detourA = ((distA - directA) / directA) * 100;
  
  // Return the route summary
  return {
    sequence: [
      { type: 'pickup', reqId: requests[0].id },
      { type: 'pickup', reqId: requests[1].id },
      { type: 'drop', reqId: requests[0].id },
      { type: 'drop', reqId: requests[1].id }
    ],
    distance: totalDistance,
    detourPercent: Math.max(0, detourA) // using A's detour as representative for MVP constraint
  };
};
