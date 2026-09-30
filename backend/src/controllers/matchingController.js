import { runClustering } from '../algorithms/clustering/clusterBuilder.js';
import { assignDriversToClusters } from '../algorithms/matching/driverMatcher.js';

export const runMatchingCycle = async (req, res, next) => {
  try {
    const { clusters } = await runClustering();
    const assignments = await assignDriversToClusters(clusters);

    res.status(200).json({
      success: true,
      data: {
        clustersFormed: clusters.length,
        assignmentsMade: assignments.length,
        assignments
      },
      message: 'Matching cycle completed'
    });
  } catch (error) {
    next(error);
  }
};
