import * as driverService from '../services/driverService.js';
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
      parameters: {
        type: 'OBJECT',
        properties: {}
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

      default:
        return { success: false, error: 'Tool not found' };
    }
  } catch (error) {
    console.error(`[Agent Tool Error] ${name}:`, error);
    return { success: false, error: error.message };
  }
};
