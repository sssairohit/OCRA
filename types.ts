export interface Ingredient {
  name: string;
  imperial: string;
  metric: string;
}

export interface Recipe {
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: Ingredient[];
  instructions: string[];
  tips?: string[];
}
