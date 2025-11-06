
export interface Recipe {
  dishName: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  ingredients: string[];
  instructions: string[];
  notes?: string;
}
