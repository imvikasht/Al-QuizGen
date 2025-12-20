
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz } from "../types";

// NOTE: Ideally this API key comes from env, but for this demo environment we rely on the prompt's instructions that process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizWithAI = async (topic: string, difficulty: string, numQuestions: number, duration: number, additionalDescription?: string): Promise<Quiz> => {
  
  const prompt = `Create a multiple choice quiz about "${topic}". 
  Difficulty: ${difficulty}. 
  Number of questions: ${numQuestions}.
  ${additionalDescription ? `Additional Context/Instructions: ${additionalDescription}` : ''}
  
  Format the output as a JSON object matching this schema. Ensure 'options' has exactly 4 choices and 'correctAnswerIndex' is 0-3.`;

  try {
    // Correct usage: Call generateContent directly on ai.models with the model name in the config
    // Updated model to 'gemini-3-pro-preview' for complex text generation tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            questionsArray: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ["questionText", "options", "correctAnswerIndex"]
              }
            }
          },
          required: ["title", "description", "questionsArray"]
        }
      }
    });

    // Correct usage: Access .text property directly (not a function)
    const text = response.text;
    
    if (!text) throw new Error("No data returned from AI");

    const data = JSON.parse(text);

    return {
      _id: `q_ai_${Date.now()}`,
      category: 'AI Generated',
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
      duration: duration,
      ...data
    };

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
