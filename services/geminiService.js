import { GoogleGenAI, Type } from "@google/genai";

// NOTE: Ideally this API key comes from env, but for this demo environment we rely on the prompt's instructions that process.env.API_KEY is available.
// Browser safety check included in index.html, but usage here implies env var availability or polyfill.
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuizWithAI = async (topic, difficulty, numQuestions, duration, additionalDescription) => {
  
  const prompt = `Create a multiple choice quiz about "${topic}". 
  Difficulty: ${difficulty}. 
  Number of questions: ${numQuestions}.
  ${additionalDescription ? `Additional Context/Instructions: ${additionalDescription}` : ''}
  
  Format the output as a JSON object matching this schema. Ensure 'options' has exactly 4 choices and 'correctAnswerIndex' is 0-3.`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
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

    const text = response.text;
    
    if (!text) throw new Error("No data returned from AI");

    const data = JSON.parse(text);

    return {
      _id: `q_ai_${Date.now()}`,
      category: 'AI Generated',
      difficulty: difficulty,
      duration: duration,
      ...data
    };

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};