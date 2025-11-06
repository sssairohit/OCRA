import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

// Initialize the Google Gemini AI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Define the JSON schema for the recipe structure we expect from the AI model.
const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'The name of the recipe.' },
    description: { type: Type.STRING, description: 'A short, enticing description of the dish.' },
    prepTime: { type: Type.STRING, description: 'Preparation time, e.g., "15 minutes".' },
    cookTime: { type: Type.STRING, description: 'Cooking time, e.g., "25 minutes".' },
    servings: { type: Type.STRING, description: 'Number of servings, e.g., "4 people".' },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'The name of the ingredient.' },
          imperial: { type: Type.STRING, description: 'The quantity in imperial units (e.g., "1 cup", "2 tbsp").' },
          metric: { type: Type.STRING, description: 'The quantity in metric units (e.g., "240ml", "30g").' }
        },
        required: ['name', 'imperial', 'metric']
      },
      description: 'A list of ingredients, each with its name and quantity in both imperial and metric units.'
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Step-by-step cooking instructions.'
    },
    tips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Optional tips for the recipe, like variations or serving suggestions.'
    }
  },
  required: ['name', 'description', 'prepTime', 'cookTime', 'servings', 'ingredients', 'instructions']
};

/**
 * Generates a recipe by calling the Gemini API with a specific dish name.
 * @param dishName The name of the dish to generate a recipe for.
 * @returns A promise that resolves to a Recipe object.
 */
export const generateRecipe = async (dishName: string): Promise<Recipe> => {
  try {
    const prompt = `Generate a detailed recipe for ${dishName}. Include a brief description, preparation time, cooking time, number of servings, step-by-step instructions, and some optional tips. For each ingredient, provide the name, and the quantity in both imperial (e.g., cups, oz) and metric (e.g., grams, ml) units.`;

    // Call the Gemini API to generate content based on the prompt and schema.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use a suitable model for this task.
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    // The response text should be a JSON string that matches the schema.
    const jsonText = response.text.trim();
    
    // The model might wrap the JSON in markdown backticks, so we clean it.
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const recipeData: Recipe = JSON.parse(cleanedJsonText);
    return recipeData;

  } catch (error) {
    console.error("Error generating recipe:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate recipe from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the recipe.");
  }
};