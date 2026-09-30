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
    
    // Instead of returning 500 which triggers the generic UI fallback,
    // we return 200 so the UI displays the actual error as a message from the agent.
    const errorMessage = error?.status === 503 
        ? "The AI model is currently experiencing high demand. Please try again in a few moments."
        : "I encountered an error trying to process your request. Please try again.";
        
    res.status(200).json({ success: false, message: errorMessage });
  }
};
