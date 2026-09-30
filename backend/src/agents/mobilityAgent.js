import { GoogleGenAI } from '@google/genai';
import { moveFlowSystemPrompt } from './agentPrompt.js';
import { getDriverToolsDefinition, executeDriverTool } from '../tools/driverTools.js';
import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({ apiKey: geminiApiKey });
}

export const executeAgentCycle = async (driverProfileId, message, context = {}) => {
  if (!ai) {
    return {
      success: true,
      text: "I am MoveFlow AI! (Demo Mode: GEMINI_API_KEY not configured in backend). You said: " + message
    };
  }

  const tools = getDriverToolsDefinition();

  const dynamicPrompt = `${moveFlowSystemPrompt}
Current Context:
- Driver Profile ID: ${driverProfileId}
- Current Date/Time: ${new Date().toISOString()}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: message,
        config: {
          systemInstruction: dynamicPrompt,
          tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
          temperature: 0.2
        }
    });

    // Check if the model wants to call a function
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0];
      const result = await executeDriverTool(functionCall.name, functionCall.args, driverProfileId, context);
      
      // We send the function response back to the model to get a natural language reply
      const followupResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ functionCall }] },
          { role: 'user', parts: [{ functionResponse: { name: functionCall.name, response: { result } } }] }
        ],
        config: {
          systemInstruction: dynamicPrompt,
          temperature: 0.2
        }
      });
      return { success: true, text: followupResponse.text };
    }

    return {
      success: true,
      text: response.text
    };

  } catch (error) {
    console.error('Mobility Agent Error:', error);
    throw error;
  }
};
