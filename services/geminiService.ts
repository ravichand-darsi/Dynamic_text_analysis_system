
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Using gemini-3-flash-preview with optimized config for maximum speed
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    systemInstruction: `You are an ultra-fast Text Analysis Engine. 
    Analyze input for:
    1. Sentiment (Overall & 5 segments)
    2. Emotions (8 types: Joy, Trust, Fear, Surprise, Sadness, Disgust, Anger, Anticipation)
    3. Entities & Topics
    4. Business Insights
    Output strictly valid JSON. Keep summaries concise.`,
    contents: `Analyze this text: "${text.substring(0, 5000)}"`,
    config: {
      responseMimeType: "application/json",
      // Disable thinking to prioritize latency/speed
      thinkingConfig: { thinkingBudget: 0 },
      temperature: 0.1, // Lower temperature for faster, more deterministic output
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          sentiment: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["label", "score"]
          },
          sentimentProgression: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                segment: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["segment", "score"]
            }
          },
          entityDistribution: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                count: { type: Type.NUMBER }
              },
              required: ["type", "count"]
            }
          },
          emotions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                score: { type: Type.NUMBER },
                emoji: { type: Type.STRING }
              },
              required: ["label", "score", "emoji"]
            }
          },
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                label: { type: Type.STRING },
                relevance: { type: Type.NUMBER }
              },
              required: ["id", "label", "relevance"]
            }
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          entities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                name: { type: Type.STRING },
                count: { type: Type.NUMBER }
              },
              required: ["type", "name", "count"]
            }
          },
          summary: {
            type: Type.OBJECT,
            properties: {
              ultraConcise: { type: Type.STRING },
              detailed: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["ultraConcise", "detailed"]
          },
          intent: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          preprocessing: {
            type: Type.OBJECT,
            properties: {
              tokens: { type: Type.ARRAY, items: { type: Type.STRING } },
              stopsRemoved: { type: Type.NUMBER },
              lemmas: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["tokens", "stopsRemoved", "lemmas"]
          }
        },
        required: ["language", "sentiment", "sentimentProgression", "entityDistribution", "emotions", "topics", "keywords", "entities", "summary", "intent", "insights", "preprocessing"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Parse Error", e);
    throw new Error("Analysis engine failed to return structured data.");
  }
};
