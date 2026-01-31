import { GoogleGenAI, Type } from "@google/genai";
import { MemeCategory, MemeData } from "./types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const SYSTEM_INSTRUCTION = `You are Saatmishaali AI — an assistant that generates original, authentic Bengali memes.
Your purpose is to create HUMOROUS, RELATABLE Bengali memes for social media.

RULES FOR BENGALI MEMES:
- Write meme captions in BENGALI (Bangla script)
- MUST be authentic Bengali humor (not translated jokes)
- Include typical Bengali cultural references
- Use Bengali slang and colloquial terms naturally
- Keep captions short (1-3 lines max)
- Can include common Bengali expressions like "ভাই", "আপু", "ও ভাই", "একদম"
- Avoid offensive or sensitive topics
- Make it relatable to everyday Bengali life
- Must be in Humanized Bengali tone with Bengali Humor style and syntax
- No emojis. No hashtags. No English translations.

MEME CATEGORIES EXPLANATION:
- Funky Bhai: Cool/funny brother vibes, street-smart humor
- Dhonnobad: Thankful/sarcastic thank you situations
- Gossip: Para/neighborhood gossip scenarios
- Biryani: Food lover humor, biryani obsession
- Traffic: Dhaka/Kolkata traffic jokes
- Exam: Student life, exam pressure humor
- Relationship: Family/friendship/romance situations
- Office: Workplace humor in Bengali context
`;

export const generateMeme = async (selectedCategory: MemeCategory): Promise<MemeData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate one authentic Bengali meme caption in the category: ${selectedCategory}. Write only in Bengali script.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The Bengali meme caption text.",
            },
            category: {
              type: Type.STRING,
              description: "The meme category used.",
            },
            template: {
              type: Type.STRING,
              description: "Suggested meme template type (e.g., classic, modern, dramatic)",
            },
            isBengali: {
              type: Type.BOOLEAN,
              description: "Whether the text is in Bengali",
            }
          },
          propertyOrdering: ["text", "category", "template", "isBengali"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) {
      throw new Error("The model did not return any text content.");
    }

    return JSON.parse(jsonStr.trim()) as MemeData;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate meme. Please try again.");
  }
};