import { getAggregatedDemand } from '../algorithms/heatmap/demandAggregator.js';

export const getDemand = async (req, res, next) => {
  try {
    const demand = await getAggregatedDemand();
    res.status(200).json({
      success: true,
      data: demand,
      message: 'Demand heatmap data retrieved'
    });
  } catch (error) {
    next(error);
  }
};
