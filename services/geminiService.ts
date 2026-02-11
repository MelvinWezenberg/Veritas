
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateResponse = async (question: string, transcript: string, seniority: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a Senior Executive Talent Evaluator. 
    Objective: Conduct a forensic analysis of this candidate's response for a ${seniority} role.
    
    Evaluation Criteria:
    1. **Structural Integrity**: Did they maintain a logical framework (STAR/PREP) or ramble?
    2. **Signal-to-Noise Ratio**: Substantive data vs. fluff/corporate speak.
    3. **Assertiveness Index**: Direct assertions vs. hedges ("I think", "maybe").
    4. **Technical Accuracy**: Rigorous correctness.
    5. **Cognitive Load Handling**: Did they handle complexity without losing rhetorical flow?
    
    Tone: Ice-cold, objective, and skeptical.

    Question: ${question}
    Transcript: ${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          technicalAccuracy: { type: Type.NUMBER, description: "Score 1-100" },
          structuralIntegrity: { type: Type.NUMBER, description: "Logic flow score 1-100" },
          assertivenessIndex: { type: Type.NUMBER, description: "Confidence score 1-100" },
          signalToNoiseRatio: { type: Type.NUMBER, description: "Information density score 1-100" },
          seniorityAlignment: { type: Type.NUMBER, description: "Score 1-100" },
          summary: { type: Type.STRING },
          keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
          isAIGenerated: { type: Type.BOOLEAN, description: "Detection of hyper-fluency or robotic patterns" },
          recommendation: { 
            type: Type.STRING, 
            enum: ["HIRE", "REJECT", "MAYBE"],
            description: "Final decision based on rigid criteria"
          },
          recommendationReason: { type: Type.STRING, description: "One sentence executive summary" },
          speechMetrics: {
             type: Type.OBJECT,
             properties: {
                 wpm: { type: Type.NUMBER, description: "Estimated words per minute" },
                 fillerWordCount: { type: Type.NUMBER },
                 fillerWords: { type: Type.ARRAY, items: { type: Type.STRING } },
                 tonality: { type: Type.STRING, enum: ["Monotone", "Expressive", "Aggressive", "Nervous", "Professional"] },
                 clarityScore: { type: Type.NUMBER }
             },
             required: ["wpm", "fillerWordCount", "fillerWords", "tonality", "clarityScore"]
          }
        },
        required: ["technicalAccuracy", "structuralIntegrity", "assertivenessIndex", "signalToNoiseRatio", "seniorityAlignment", "summary", "isAIGenerated", "recommendation", "recommendationReason", "speechMetrics"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateFollowUpProbe = async (question: string, transcript: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a skeptical Senior Executive conducting a stress test.
    
    Your Goal: Inject COGNITIVE LOAD.
    Strategy:
    1. If they were technical, introduce a contradictory constraint (e.g., "The budget was just cut by 50%, how does that change your architecture?").
    2. If they were general, interrupt to demand a specific ROI metric.
    3. If they dodged, call it out directly.
    
    Output ONE sharp, cutting follow-up question. (Max 20 words).
    
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
    
    Generate 3 specific, high-stakes technical screening questions (IRT style).`,
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
          rationale: { type: Type.STRING, description: "Brief explanation of why these questions were chosen" }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateCandidateFeedbackReport = async (transcript: string, scoreData: any) => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a brutal but constructive executive feedback report.
        Transcript: ${transcript}
        Scores: ${JSON.stringify(scoreData)}
        
        Focus on "Recovery Latency" (how they handled pressure) and "Cognitive Load".
        Tone: Professional, direct, no fluff.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    careerTips: { type: Type.STRING, description: "Strategic advice for executive presence." }
                }
            }
        }
    });
    return JSON.parse(response.text);
}
