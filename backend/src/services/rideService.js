import { supabase } from '../config/database.js';

// Calculate distance in km between two lat/lng coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; 
  return d;
};

// Calculate fare based on distance and passenger count
const calculateFare = (distance, passengerCount) => {
  const baseFare = 10;
  const perKmRate = 15;
  const total = (baseFare + (distance * perKmRate)) * passengerCount;
  // Round to nearest 5
  return Math.round(total / 5) * 5;
};

export const getDriverDashboardStats = async (driverId) => {
  // Get today's completed rides for this driver
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: rides, error } = await supabase
    .from('ride_requests')
    .select('*')
    .eq('assigned_driver_id', driverId)
    .eq('status', 'completed')
    .gte('requested_at', startOfDay.toISOString());

  if (error) throw error;

  let totalRevenue = 0;
  let completedTrips = rides.length;
  let seatsServed = 0;

  rides.forEach(ride => {
    seatsServed += ride.passenger_count || 1;
    const distance = calculateDistance(ride.pickup_lat, ride.pickup_lng, ride.destination_lat, ride.destination_lng);
    totalRevenue += calculateFare(distance, ride.passenger_count || 1);
  });

  const avgRevenuePerTrip = completedTrips > 0 ? (totalRevenue / completedTrips).toFixed(1) : 0;

  return {
    todayRevenue: totalRevenue,
    completedTrips,
    seatsServed,
    avgRevenuePerTrip
  };
};

export const getDriverRideHistory = async (driverId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { data: rides, error, count } = await supabase
    .from('ride_requests')
    .select('*', { count: 'exact' })
    .eq('assigned_driver_id', driverId)
    .in('status', ['completed', 'cancelled'])
    .order('requested_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  // Add calculated fare and distance to each ride
  const enhancedRides = rides.map(ride => {
    const distance = calculateDistance(ride.pickup_lat, ride.pickup_lng, ride.destination_lat, ride.destination_lng);
    return {
      ...ride,
      distance: parseFloat(distance.toFixed(2)),
      fare: calculateFare(distance, ride.passenger_count || 1)
    };
  });

  return {
    rides: enhancedRides,
    total: count,
    page,
    totalPages: Math.ceil(count / limit)
  };
};

export const getActiveRideRequests = async (driverId) => {
  // For now, return any pending requests as a mock of "nearby requests"
  // In a real scenario, this would filter by geo-radius around the driver
  const { data: requests, error } = await supabase
    .from('ride_requests')
    .select('*')
    .eq('status', 'pending')
    .order('requested_at', { ascending: false })
    .limit(10);

  if (error) throw error;

  // Enhance with distance and fare
  const enhancedRequests = requests.map(req => {
    const distance = calculateDistance(req.pickup_lat, req.pickup_lng, req.destination_lat, req.destination_lng);
    return {
      ...req,
      distance: parseFloat(distance.toFixed(2)),
      fare: calculateFare(distance, req.passenger_count || 1)
    };
  });

  return enhancedRequests;
};

export const updateRideRequestStatus = async (driverId, requestId, status) => {
  // Validate ownership if accepting (ensure it's not already accepted)
  if (status === 'accepted') {
    const { data: reqCheck } = await supabase
      .from('ride_requests')
      .select('status')
      .eq('id', requestId)
      .single();
      
    if (reqCheck && reqCheck.status !== 'pending') {
      throw new Error('Request is no longer available');
    }
  }

  const updates = { status };
  if (status === 'accepted' || status === 'completed') {
    updates.assigned_driver_id = driverId;
  }

  const { data, error } = await supabase
    .from('ride_requests')
    .update(updates)
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createRideRequest = async (profileId, requestData) => {
  const { data, error } = await supabase
    .from('ride_requests')
    .insert([
      {
        pickup_lat: requestData.pickup_lat,
        pickup_lng: requestData.pickup_lng,
        destination_lat: requestData.destination_lat,
        destination_lng: requestData.destination_lng,
        passenger_count: requestData.passenger_count || 1,
        status: requestData.status,
        requested_at: requestData.requested_at
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
