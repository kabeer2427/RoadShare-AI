import { createRideSchema } from '../validators/rideValidators.js';
import * as rideService from '../services/rideService.js';

export const createRide = async (req, res, next) => {
  try {
    const validatedData = createRideSchema.parse(req.body);
    const ride = await rideService.requestRide(req.user.id, validatedData);
    
    res.status(201).json({
      success: true,
      data: ride,
      message: 'Ride requested successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getRide = async (req, res, next) => {
  try {
    const ride = await rideService.getRideStatus(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: ride,
      message: 'Ride details retrieved'
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRide = async (req, res, next) => {
  try {
    const ride = await rideService.cancelRide(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data: ride,
      message: 'Ride cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await rideService.getHistory(req.user.id);
    res.status(200).json({
      success: true,
      data: history,
      message: 'Ride history retrieved'
    });
  } catch (error) {
    next(error);
  }
};
