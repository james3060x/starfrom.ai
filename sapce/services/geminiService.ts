
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async sendMessage(systemInstruction: string, history: ChatMessage[], message: string, isImageMode: boolean = false) {
    const modelName = isImageMode ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';
    
    // Always create a fresh instance to ensure the latest API key is used
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const response: GenerateContentResponse = await aiInstance.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: message }]
      },
      config: {
        systemInstruction: isImageMode 
          ? `${systemInstruction}\n\nYou are currently in IMAGE GENERATION MODE. Focus on generating a high-quality visual representation based on the user's request.` 
          : systemInstruction,
        ...(isImageMode ? { imageConfig: { aspectRatio: "1:1" } } : {})
      },
    });

    const result: { text?: string; imageUrl?: string } = {};

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          result.imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          result.text = (result.text || '') + part.text;
        }
      }
    }

    // Fallback to basic .text property if parts logic didn't catch it
    if (!result.text && !result.imageUrl) {
      result.text = response.text;
    }

    return result;
  }
}

export const geminiService = new GeminiService();
