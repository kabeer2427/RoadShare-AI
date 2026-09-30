import * as rideRepo from '../repositories/rideRepository.js';
// We will import clustering/matching engine later

export const requestRide = async (commuterId, rideData) => {
  // 1. Validate commuter role if necessary (handled by middleware)
  
  // 2. Insert ride request
  const newRide = await rideRepo.createRideRequest({
    commuter_id: commuterId,
    pickup_lat: rideData.pickup_lat,
    pickup_lng: rideData.pickup_lng,
    destination_lat: rideData.destination_lat,
    destination_lng: rideData.destination_lng,
    passenger_count: rideData.passenger_count,
    status: 'pending'
  });

  // 3. (Future) Trigger matching engine asynchronously or synchronously
  // e.g. eventBus.emit('new_ride', newRide.id);

  return newRide;
};

export const cancelRide = async (commuterId, rideId) => {
  const ride = await rideRepo.getRideById(rideId, commuterId);
  if (!ride) {
    const error = new Error('Ride not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (ride.status === 'completed' || ride.status === 'cancelled') {
    const error = new Error('Cannot cancel ride in current state');
    error.statusCode = 400;
    throw error;
  }

  return await rideRepo.updateRideStatus(rideId, commuterId, 'cancelled');
};

export const getRideStatus = async (commuterId, rideId) => {
  const ride = await rideRepo.getRideById(rideId, commuterId);
  if (!ride) {
    const error = new Error('Ride not found');
    error.statusCode = 404;
    throw error;
  }
  return ride;
};

export const getHistory = async (commuterId) => {
  return await rideRepo.getRideHistory(commuterId);
};
