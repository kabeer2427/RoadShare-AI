import * as driverRepo from '../repositories/driverRepository.js';

export const goOnline = async (profileId) => {
  return await driverRepo.updateDriverStatus(profileId, true);
};

export const goOffline = async (profileId) => {
  return await driverRepo.updateDriverStatus(profileId, false);
};

export const updateLocation = async (profileId, lat, lng) => {
  // We could add throttling logic here using Redis or in-memory map
  // e.g., if last update was < 5 seconds ago, ignore.
  return await driverRepo.updateDriverLocation(profileId, lat, lng);
};

export const getCurrentRoute = async (profileId) => {
  const driver = await driverRepo.getDriverByProfileId(profileId);
  if (!driver) {
    const err = new Error('Driver not found');
    err.statusCode = 404;
    throw err;
  }
  return await driverRepo.getActiveRoute(driver.id);
};

export const getNearby = async (lat, lng, radius) => {
  return await driverRepo.getNearbyDrivers(lat, lng, radius);
};
