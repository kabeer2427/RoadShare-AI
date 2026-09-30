import * as rideService from '../services/rideService.js';
import * as driverRepository from '../repositories/driverRepository.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const profileId = req.user.id;
    // We need the driver's internal id to query ride requests
    const driver = await driverRepository.getDriverByProfileId(profileId);
    
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const stats = await rideService.getDriverDashboardStats(driver.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getRideHistory = async (req, res, next) => {
  try {
    const profileId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const driver = await driverRepository.getDriverByProfileId(profileId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const history = await rideService.getDriverRideHistory(driver.id, page, limit);
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const getActiveRequests = async (req, res, next) => {
  try {
    const profileId = req.user.id;
    const driver = await driverRepository.getDriverByProfileId(profileId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const requests = await rideService.getActiveRideRequests(driver.id);
    res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const acceptRideRequest = async (req, res, next) => {
  try {
    const profileId = req.user.id;
    const requestId = req.params.id;

    const driver = await driverRepository.getDriverByProfileId(profileId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    const updatedRequest = await rideService.updateRideRequestStatus(driver.id, requestId, 'accepted');
    res.json({ success: true, data: updatedRequest, message: 'Ride request accepted' });
  } catch (error) {
    next(error);
  }
};

export const declineRideRequest = async (req, res, next) => {
  try {
    const profileId = req.user.id;
    const requestId = req.params.id;

    const driver = await driverRepository.getDriverByProfileId(profileId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver profile not found' });
    }

    // A decline just moves the status back to pending, or maybe logs it as declined by this specific driver.
    // For MVP, we can keep it as pending so other drivers can take it, or update it to cancelled.
    // Let's just set it to 'pending' to release it back into the pool.
    const updatedRequest = await rideService.updateRideRequestStatus(null, requestId, 'pending');
    res.json({ success: true, data: updatedRequest, message: 'Ride request declined' });
  } catch (error) {
    next(error);
  }
};

export const createRideRequest = async (req, res, next) => {
  try {
    const profileId = req.user.id;
    const { pickup_lat, pickup_lng, destination_lat, destination_lng, passenger_count } = req.body;
    
    // We can assume profile is valid because of auth middleware
    const requestData = {
      pickup_lat,
      pickup_lng,
      destination_lat,
      destination_lng,
      passenger_count,
      status: 'pending',
      requested_at: new Date()
    };
    
    const newRequest = await rideService.createRideRequest(profileId, requestData);
    res.status(201).json({ success: true, data: newRequest, message: 'Ride requested successfully' });
  } catch (error) {
    next(error);
  }
};
