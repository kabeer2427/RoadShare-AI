import { executeAgentCycle } from '../agents/mobilityAgent.js';

export const chatWithAgent = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const driverProfileId = req.user.id;
    const response = await executeAgentCycle(driverProfileId, message);

    res.json({
      success: true,
      message: response.text
    });

  } catch (error) {
    console.error('Agent Error:', error);
    res.status(500).json({ success: false, message: "I couldn't process that right now. Please try again." });
  }
};
