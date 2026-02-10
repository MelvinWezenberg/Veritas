
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateResponse = async (question: string, transcript: string, seniority: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this technical interview response for a ${seniority} position. 
    Question: ${question}
    Transcript: ${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          technicalAccuracy: { type: Type.NUMBER, description: "Score from 1-100" },
          coherence: { type: Type.NUMBER, description: "Score from 1-100" },
          seniorityAlignment: { type: Type.NUMBER, description: "Score from 1-100" },
          summary: { type: Type.STRING },
          keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
          isAIGenerated: { type: Type.BOOLEAN, description: "Detection of hyper-fluency or robotic patterns" },
          recommendation: { 
            type: Type.STRING, 
            enum: ["HIRE", "REJECT", "MAYBE"],
            description: "Final decision based on technical and soft skills"
          },
          recommendationReason: { type: Type.STRING, description: "One sentence reasoning for the recommendation" }
        },
        required: ["technicalAccuracy", "coherence", "seniorityAlignment", "summary", "isAIGenerated", "recommendation", "recommendationReason"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateFollowUpProbe = async (question: string, transcript: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this initial technical response, generate a single, sharp follow-up probe that tests the candidate's deeper understanding or asks them to clarify a specific point they made. Keep it under 20 words.
    
    Original Question: ${question}
    Candidate Response: ${transcript}`,
  });

  return response.text;
};

export const evaluateGhostAccount = async (metadata: any) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Evaluate if this is a ghost/burner account based on metadata:
    Account Age: ${metadata.accountAgeYears} years
    Connection Density: ${metadata.connectionDensity}/10
    Profile Completion: ${metadata.profileCompletion}%`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trustScore: { type: Type.NUMBER, description: "1-100 scale" },
          isSuspicious: { type: Type.BOOLEAN },
          reasoning: { type: Type.STRING }
        },
        required: ["trustScore", "isSuspicious", "reasoning"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateAssessmentCriteria = async (jobContext: string, idealCandidate: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert technical recruiter. 
    Job Context: ${jobContext}
    Ideal Candidate: ${idealCandidate}
    
    Generate 3 specific, high-stakes technical screening questions (IRT style) and a suggested weight distribution for scoring (Technical, Communication, Authenticity, Seniority) that sums to 100%.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                category: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              }
            }
          },
          weights: {
             type: Type.OBJECT,
             properties: {
               technicalAccuracy: { type: Type.NUMBER },
               coherence: { type: Type.NUMBER },
               authenticity: { type: Type.NUMBER },
               seniorityAlignment: { type: Type.NUMBER }
             }
          },
          rationale: { type: Type.STRING, description: "Brief explanation of why these weights/questions were chosen" }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
