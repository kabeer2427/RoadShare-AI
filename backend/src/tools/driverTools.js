import * as driverService from '../services/driverService.js';
import * as rideService from '../services/rideService.js';
import * as driverRepository from '../repositories/driverRepository.js';
import { getAggregatedDemand } from '../algorithms/heatmap/demandAggregator.js';

export const getDriverToolsDefinition = () => {
  return [
    {
      name: 'get_nearby_demand',
      description: 'Get aggregated heatmap demand for rides in the vicinity.',
      parameters: {
        type: 'OBJECT',
        properties: {
          lat: { type: 'NUMBER', description: 'Latitude' },
          lng: { type: 'NUMBER', description: 'Longitude' }
        }
      }
    },
    {
      name: 'go_online',
      description: 'Set the driver status to online so they can receive matches.',
      parameters: {
        type: 'OBJECT',
        properties: {}
      }
    },
    {
      name: 'go_offline',
      description: 'Set the driver status to offline to stop receiving matches.',
      parameters: {
        type: 'OBJECT',
        properties: {}
      }
    },
    {
      name: 'get_current_route',
      description: 'Get the active route and assignments for the driver.',
      parameters: { type: 'OBJECT', properties: {} }
    },
    {
      name: 'get_driver_earnings',
      description: 'Get today\'s revenue, trips, and seats served.',
      parameters: { type: 'OBJECT', properties: {} }
    },
    {
      name: 'get_driver_ride_history',
      description: 'Get the latest completed rides for this driver.',
      parameters: { type: 'OBJECT', properties: {} }
    },
    {
      name: 'get_nearby_ride_requests',
      description: 'Find active pending ride requests that are compatible with the driver.',
      parameters: { type: 'OBJECT', properties: {} }
    },
    {
      name: 'accept_ride_request',
      description: 'Accept a specific ride request by its ID.',
      parameters: {
        type: 'OBJECT',
        properties: {
          requestId: { type: 'STRING', description: 'The UUID of the ride request' }
        }
      }
    },
    {
      name: 'decline_ride_request',
      description: 'Decline a specific ride request by its ID.',
      parameters: {
        type: 'OBJECT',
        properties: {
          requestId: { type: 'STRING', description: 'The UUID of the ride request' }
        }
      }
    }
  ];
};

export const executeDriverTool = async (name, args, driverProfileId, context) => {
  console.log(`[Agent Tool Call] ${name} with args:`, args);
  try {
    switch (name) {
      case 'get_nearby_demand':
        const demand = await getAggregatedDemand();
        return { success: true, data: demand.slice(0, 10), note: "Top 10 demand points" };
      
      case 'go_online':
        await driverService.goOnline(driverProfileId);
        return { success: true, message: 'Driver is now online.' };

      case 'go_offline':
        await driverService.goOffline(driverProfileId);
        return { success: true, message: 'Driver is now offline.' };

      case 'get_current_route':
        try {
          const route = await driverService.getCurrentRoute(driverProfileId);
          return { success: true, route: route || 'No active route found.' };
        } catch (e) {
          if (e.statusCode === 404) return { success: true, route: 'No active route found.' };
          throw e;
        }

      case 'get_driver_earnings': {
        const driver = await driverRepository.getDriverByProfileId(driverProfileId);
        const stats = await rideService.getDriverDashboardStats(driver.id);
        return { success: true, stats };
      }

      case 'get_driver_ride_history': {
        const driver = await driverRepository.getDriverByProfileId(driverProfileId);
        const history = await rideService.getDriverRideHistory(driver.id, 1, 5);
        return { success: true, history };
      }

      case 'get_nearby_ride_requests': {
        const driver = await driverRepository.getDriverByProfileId(driverProfileId);
        const reqs = await rideService.getActiveRideRequests(driver.id);
        return { success: true, requests: reqs };
      }

      case 'accept_ride_request': {
        const driver = await driverRepository.getDriverByProfileId(driverProfileId);
        const accepted = await rideService.updateRideRequestStatus(driver.id, args.requestId, 'accepted');
        return { success: true, request: accepted };
      }

      case 'decline_ride_request': {
        await rideService.updateRideRequestStatus(null, args.requestId, 'pending');
        return { success: true, message: 'Request declined.' };
      }

      default:
        return { success: false, error: 'Tool not found' };
    }
  } catch (error) {
    console.error(`[Agent Tool Error] ${name}:`, error);
    return { success: false, error: error.message };
  }
};
