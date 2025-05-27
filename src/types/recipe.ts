export interface Recipe {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  cuisines?: string[];
  diets?: string[];
  dishTypes?: string[];
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image?: string;
}

export interface Instruction {
  number: number;
  step: string;
  ingredients?: Ingredient[];
  equipment?: Equipment[];
}

export interface Equipment {
  id: number;
  name: string;
  image?: string;
}

// For search results which contain less information
export interface RecipePreview {
  id: string;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}