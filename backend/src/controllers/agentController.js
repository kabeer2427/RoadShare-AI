import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
let ai = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({ apiKey: geminiApiKey });
} else {
  console.warn('GEMINI_API_KEY is not set. MoveFlow AI will use fallback demo responses.');
}

export const chatWithAgent = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!ai) {
      return res.json({
        success: true,
        message: "I am MoveFlow AI! (Demo Mode: GEMINI_API_KEY not configured in backend). You said: " + message
      });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: `You are MoveFlow AI, the intelligent mobility assistant for an AI-powered shared e-rickshaw and auto-rickshaw platform in India. Keep responses very concise and helpful.`,
        }
    });

    res.json({
      success: true,
      message: response.text
    });

  } catch (error) {
    console.error('Agent Error:', error);
    res.status(500).json({ success: false, message: "I couldn't process that right now. Please try again." });
  }
};
