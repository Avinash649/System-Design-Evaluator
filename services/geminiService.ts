
import { GoogleGenAI, Type } from "@google/genai";
import { DesignData, Evaluation } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a placeholder check. The environment variable is expected to be set.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const evaluateDesign = async (designData: DesignData): Promise<Evaluation> => {
  try {
    const prompt = `
      You are an expert software architect and system design interviewer reviewing a candidate's proposal.
      Your task is to evaluate the system design based on the provided details. Provide a score from 1.0 to 10.0 
      (where 1.0 is poor and 10.0 is excellent) and constructive feedback. The feedback should be in Markdown format.

      Here is the user's design proposal:

      **1. Problem Definition:**
      ${designData.problem}

      **2. Requirements & Constraints:**
      ${designData.requirements}

      **3. Architecture Sketch:**
      ${designData.architecture}

      **4. Design Decisions & Trade-offs:**
      ${designData.decisions}

      Evaluate this design on its coherence, completeness, scalability, reliability, fault tolerance, and feasibility. 
      Identify its strengths and weaknesses. Be specific in your feedback.

      Return your evaluation ONLY in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "A score from 1.0 to 10.0 evaluating the system design."
            },
            feedback: {
              type: Type.STRING,
              description: "Detailed, constructive feedback in Markdown format."
            }
          },
          required: ["score", "feedback"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Validate the result
    if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
      throw new Error("Invalid response format from AI model.");
    }
    
    return result as Evaluation;

  } catch (error) {
    console.error("Error evaluating design with Gemini API:", error);
    throw new Error("Failed to get an evaluation from the AI. Please check your API key and try again.");
  }
};
