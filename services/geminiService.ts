
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING, description: "The name of the dish." },
    description: { type: Type.STRING, description: "A brief, enticing description of the dish." },
    prepTime: { type: Type.STRING, description: "Preparation time, e.g., '15 minutes'." },
    cookTime: { type: Type.STRING, description: "Cooking time, e.g., '30 minutes'." },
    servings: { type: Type.STRING, description: "Number of servings, e.g., '4 servings'." },
    ingredients: {
      type: Type.ARRAY,
      description: "A list of all ingredients with quantities.",
      items: { type: Type.STRING }
    },
    instructions: {
      type: Type.ARRAY,
      description: "Step-by-step instructions for preparing the dish.",
      items: { type: Type.STRING }
    },
    notes: {
      type: Type.STRING,
      description: "Optional tips, variations, or storage instructions for the recipe."
    }
  },
  required: ['dishName', 'description', 'ingredients', 'instructions']
};


export const generateRecipe = async (dishName: string): Promise<Recipe> => {
  try {
    const prompt = `You are a world-class chef creating a recipe book. Generate a clear, concise, and easy-to-follow recipe for "${dishName}". Ensure the response strictly follows the provided JSON schema.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const text = response.text.trim();
    const recipeData = JSON.parse(text);

    return recipeData as Recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate recipe from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the recipe.");
  }
};
