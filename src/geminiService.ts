import { GoogleGenAI, Type } from "@google/genai";
import { AuthorCategory, QuoteData } from "./types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `You are Saatmishaali AI — an assistant that generates authentic Bengali literary quotes from famous Bengali authors and poets.

YOUR TASK:
1. Generate ONE original, meaningful Bengali quote from the selected author
2. Focus on themes: sadness, reality, life, love, philosophy, human emotions
3. MUST be in BENGALI script (Bangla) only
4. MUST be original or authentic to the author's style (not famous/common quotes)

RULES:
- Quote MUST be in Bengali script
- Keep it 1-2 lines maximum
- Should reflect the author's unique style and philosophy
- Should be thought-provoking, emotional, or philosophical
- No emojis, hashtags, or English translations
- No explanations or commentary
- Just the quote and author name

AUTHOR STYLES:
- রবীন্দ্রনাথ ঠাকুর: Philosophical, spiritual, poetic, profound
- কাজী নজরুল ইসলাম: Revolutionary, passionate, emotional, powerful
- হুমায়ূন আহমেদ: Simple yet deep, relatable, emotional, everyday philosophy
- জীবনানন্দ দাশ: Melancholic, nature-oriented, profound sadness
- শরৎচন্দ্র চট্টোপাধ্যায়: Emotional, social issues, human relationships
- তসলিমা নাসরিন: Bold, feminist, realistic, provocative
- বুদ্ধদেব বসু: Modern, intellectual, thoughtful
- আধুনিক বাংলা সাহিত্য: Contemporary themes, relatable modern life
`;

export const generateQuote = async (selectedAuthor: AuthorCategory): Promise<QuoteData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate one original Bengali quote in the style of: ${selectedAuthor}. The quote should be emotional, philosophical, or about life's realities. Write only in Bengali script.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: {
              type: Type.STRING,
              description: "The generated Bengali quote text.",
            },
            author: {
              type: Type.STRING,
              description: "The author's name in Bengali.",
            },
            category: {
              type: Type.STRING,
              description: "The category/theme of the quote (e.g., sad, love, reality, life).",
            },
            isBengali: {
              type: Type.BOOLEAN,
              description: "Whether the text is in Bengali (should always be true)",
            }
          },
          propertyOrdering: ["quote", "author", "category", "isBengali"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("The model did not return any text content.");
    }

    return JSON.parse(jsonStr.trim()) as QuoteData;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate quote. Please try again.");
  }
};