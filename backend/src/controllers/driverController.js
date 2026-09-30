import { locationSchema } from '../validators/driverValidators.js';
import * as driverService from '../services/driverService.js';

export const setOnline = async (req, res, next) => {
  try {
    const driver = await driverService.goOnline(req.user.id);
    res.status(200).json({ success: true, data: driver, message: 'Driver is now online' });
  } catch (error) {
    next(error);
  }
};

export const setOffline = async (req, res, next) => {
  try {
    const driver = await driverService.goOffline(req.user.id);
    res.status(200).json({ success: true, data: driver, message: 'Driver is now offline' });
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = locationSchema.parse(req.body);
    const driver = await driverService.updateLocation(req.user.id, lat, lng);
    res.status(200).json({ success: true, data: driver, message: 'Location updated' });
  } catch (error) {
    next(error);
  }
};

export const getNearbyDrivers = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseFloat(req.query.radius) || 2000;
    
    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, error: { message: 'lat and lng are required' }});
    }

    const drivers = await driverService.getNearby(lat, lng, radius);
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    next(error);
  }
};

export const getCurrentRoute = async (req, res, next) => {
  try {
    const route = await driverService.getCurrentRoute(req.user.id);
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};
