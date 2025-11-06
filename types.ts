
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  dishName: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  ingredients: Ingredient[];
  instructions: string[];
  notes?: string;
}