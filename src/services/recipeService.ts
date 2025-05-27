import { Recipe, RecipePreview } from '../types/recipe';

// Mock data for demo purposes
// In a real app, this would be fetched from an API like Spoonacular
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Garlic Butter Shrimp Pasta',
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readyInMinutes: 25,
    servings: 4,
    summary: 'A delicious pasta dish with garlic butter shrimp that can be prepared in just 25 minutes. Perfect for a quick weeknight dinner.',
    ingredients: [
      { id: 101, name: 'linguine pasta', amount: 8, unit: 'oz' },
      { id: 102, name: 'large shrimp', amount: 1, unit: 'lb' },
      { id: 103, name: 'butter', amount: 4, unit: 'tbsp' },
      { id: 104, name: 'garlic', amount: 4, unit: 'cloves' },
      { id: 105, name: 'red pepper flakes', amount: 0.25, unit: 'tsp' },
      { id: 106, name: 'salt', amount: 0.5, unit: 'tsp' },
      { id: 107, name: 'black pepper', amount: 0.25, unit: 'tsp' },
      { id: 108, name: 'parsley', amount: 2, unit: 'tbsp' },
      { id: 109, name: 'lemon juice', amount: 2, unit: 'tbsp' },
      { id: 110, name: 'parmesan cheese', amount: 0.25, unit: 'cup' }
    ],
    instructions: [
      { number: 1, step: 'Cook pasta according to package directions. Drain and set aside.' },
      { number: 2, step: 'While pasta is cooking, prepare the shrimp. Season shrimp with salt and pepper.' },
      { number: 3, step: 'In a large skillet, melt 2 tablespoons of butter over medium-high heat.' },
      { number: 4, step: 'Add shrimp to the skillet and cook for 1-2 minutes per side until pink and cooked through. Remove shrimp from the pan and set aside.' },
      { number: 5, step: 'In the same skillet, add remaining butter. Once melted, add minced garlic and red pepper flakes. Cook for about 1 minute until fragrant.' },
      { number: 6, step: 'Add the cooked pasta to the skillet and toss to coat in the garlic butter sauce.' },
      { number: 7, step: 'Return the shrimp to the skillet and add lemon juice. Toss to combine and heat through.' },
      { number: 8, step: 'Remove from heat and sprinkle with chopped parsley and grated parmesan cheese.' },
      { number: 9, step: 'Serve immediately and enjoy!' }
    ],
    cuisines: ['Italian', 'Mediterranean'],
    diets: ['Pescatarian'],
    dishTypes: ['main course', 'dinner']
  },
  {
    id: '2',
    title: 'Classic Beef Chili',
    image: 'https://images.pexels.com/photos/8471703/pexels-photo-8471703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readyInMinutes: 60,
    servings: 6,
    summary: 'This hearty beef chili is perfect for cold days. Simmered with spices and beans for a rich flavor that only gets better the next day.',
    ingredients: [
      { id: 201, name: 'ground beef', amount: 2, unit: 'lbs' },
      { id: 202, name: 'onion', amount: 1, unit: 'large' },
      { id: 203, name: 'bell pepper', amount: 1, unit: 'large' },
      { id: 204, name: 'garlic', amount: 3, unit: 'cloves' },
      { id: 205, name: 'kidney beans', amount: 30, unit: 'oz' },
      { id: 206, name: 'diced tomatoes', amount: 28, unit: 'oz' },
      { id: 207, name: 'tomato sauce', amount: 15, unit: 'oz' },
      { id: 208, name: 'chili powder', amount: 2, unit: 'tbsp' },
      { id: 209, name: 'cumin', amount: 1, unit: 'tbsp' },
      { id: 210, name: 'oregano', amount: 1, unit: 'tsp' },
      { id: 211, name: 'salt', amount: 1, unit: 'tsp' },
      { id: 212, name: 'black pepper', amount: 0.5, unit: 'tsp' }
    ],
    instructions: [
      { number: 1, step: 'In a large pot, brown the ground beef over medium-high heat, breaking it up as it cooks.' },
      { number: 2, step: 'Once beef is browned, drain excess fat if necessary.' },
      { number: 3, step: 'Add diced onion and bell pepper to the pot. Cook for about 5 minutes until vegetables begin to soften.' },
      { number: 4, step: 'Add minced garlic and cook for another 30 seconds until fragrant.' },
      { number: 5, step: 'Stir in chili powder, cumin, oregano, salt, and pepper. Cook for 1 minute to bloom the spices.' },
      { number: 6, step: 'Add diced tomatoes with their juice, tomato sauce, and drained kidney beans. Stir to combine.' },
      { number: 7, step: 'Bring to a simmer, then reduce heat to low. Cover and cook for at least 30 minutes, stirring occasionally.' },
      { number: 8, step: 'For best flavor, simmer for 45-60 minutes. If chili becomes too thick, add a little water or beef broth.' },
      { number: 9, step: 'Taste and adjust seasoning if needed. Serve hot with your favorite toppings like cheese, sour cream, or green onions.' }
    ],
    cuisines: ['American', 'Mexican'],
    diets: [],
    dishTypes: ['main course', 'soup']
  },
  {
    id: '3',
    title: 'Vegetable Stir Fry',
    image: 'https://images.pexels.com/photos/6605196/pexels-photo-6605196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readyInMinutes: 20,
    servings: 4,
    summary: 'A quick and healthy vegetable stir fry that comes together in just 20 minutes. Customize with your favorite vegetables and protein.',
    ingredients: [
      { id: 301, name: 'broccoli', amount: 2, unit: 'cups' },
      { id: 302, name: 'bell peppers', amount: 2, unit: 'medium' },
      { id: 303, name: 'carrots', amount: 2, unit: 'medium' },
      { id: 304, name: 'snow peas', amount: 1, unit: 'cup' },
      { id: 305, name: 'mushrooms', amount: 8, unit: 'oz' },
      { id: 306, name: 'garlic', amount: 3, unit: 'cloves' },
      { id: 307, name: 'ginger', amount: 1, unit: 'tbsp' },
      { id: 308, name: 'soy sauce', amount: 3, unit: 'tbsp' },
      { id: 309, name: 'sesame oil', amount: 1, unit: 'tbsp' },
      { id: 310, name: 'vegetable oil', amount: 2, unit: 'tbsp' },
      { id: 311, name: 'cornstarch', amount: 1, unit: 'tsp' },
      { id: 312, name: 'water', amount: 0.25, unit: 'cup' }
    ],
    instructions: [
      { number: 1, step: 'Prepare all vegetables: cut broccoli into florets, slice bell peppers into strips, julienne or slice carrots, trim snow peas, and slice mushrooms.' },
      { number: 2, step: 'In a small bowl, mix together soy sauce, sesame oil, and cornstarch dissolved in water. Set this sauce aside.' },
      { number: 3, step: 'Heat vegetable oil in a large wok or skillet over high heat.' },
      { number: 4, step: 'Add minced garlic and ginger, stir for about 30 seconds until fragrant.' },
      { number: 5, step: 'Add carrots and stir fry for 2 minutes as they take longest to cook.' },
      { number: 6, step: 'Add broccoli and bell peppers, stir fry for another 2-3 minutes.' },
      { number: 7, step: 'Add mushrooms and snow peas, continue to stir fry for 1-2 minutes until vegetables are crisp-tender.' },
      { number: 8, step: 'Pour the sauce over the vegetables and toss to coat. Cook for another minute until the sauce thickens slightly.' },
      { number: 9, step: 'Serve immediately over rice or noodles if desired.' }
    ],
    cuisines: ['Asian', 'Chinese'],
    diets: ['Vegan', 'Vegetarian'],
    dishTypes: ['main course', 'side dish']
  },
  {
    id: '4',
    title: 'Banana Chocolate Chip Muffins',
    image: 'https://images.pexels.com/photos/5591474/pexels-photo-5591474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    readyInMinutes: 35,
    servings: 12,
    summary: 'Delicious homemade banana muffins studded with chocolate chips. Perfect for breakfast or a sweet snack. Uses overripe bananas for the best flavor.',
    ingredients: [
      { id: 401, name: 'ripe bananas', amount: 3, unit: 'medium' },
      { id: 402, name: 'all-purpose flour', amount: 1.5, unit: 'cups' },
      { id: 403, name: 'granulated sugar', amount: 0.75, unit: 'cup' },
      { id: 404, name: 'unsalted butter', amount: 0.33, unit: 'cup' },
      { id: 405, name: 'eggs', amount: 1, unit: 'large' },
      { id: 406, name: 'vanilla extract', amount: 1, unit: 'tsp' },
      { id: 407, name: 'baking soda', amount: 1, unit: 'tsp' },
      { id: 408, name: 'salt', amount: 0.25, unit: 'tsp' },
      { id: 409, name: 'chocolate chips', amount: 1, unit: 'cup' }
    ],
    instructions: [
      { number: 1, step: 'Preheat oven to 350°F (175°C). Line a 12-cup muffin tin with paper liners or grease well.' },
      { number: 2, step: 'In a large bowl, mash the ripe bananas with a fork until smooth.' },
      { number: 3, step: 'Melt the butter and add to the mashed bananas. Mix well.' },
      { number: 4, step: 'Add the sugar, beaten egg, and vanilla extract to the banana mixture. Stir until combined.' },
      { number: 5, step: 'In a separate bowl, whisk together the flour, baking soda, and salt.' },
      { number: 6, step: 'Gently fold the dry ingredients into the wet ingredients until just combined. Do not overmix.' },
      { number: 7, step: 'Fold in the chocolate chips, reserving a few for topping if desired.' },
      { number: 8, step: 'Divide the batter evenly among the muffin cups, filling each about 2/3 full.' },
      { number: 9, step: 'If reserved, sprinkle the remaining chocolate chips on top of the muffins.' },
      { number: 10, step: 'Bake for 20-25 minutes, or until a toothpick inserted into the center of a muffin comes out clean.' },
      { number: 11, step: 'Allow muffins to cool in the pan for 10 minutes, then transfer to a wire rack to cool completely.' }
    ],
    cuisines: ['American'],
    diets: ['Vegetarian'],
    dishTypes: ['breakfast', 'snack', 'dessert']
  }
];

export const searchRecipes = async (query: string): Promise<RecipePreview[]> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredRecipes = mockRecipes
        .filter(recipe => 
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.cuisines?.some(cuisine => cuisine.toLowerCase().includes(query.toLowerCase())) ||
          recipe.dishTypes?.some(type => type.toLowerCase().includes(query.toLowerCase()))
        )
        .map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          readyInMinutes: recipe.readyInMinutes,
          servings: recipe.servings
        }));
      
      resolve(filteredRecipes);
    }, 500); // Simulate network delay
  });
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const recipe = mockRecipes.find(recipe => recipe.id === id) || null;
      resolve(recipe);
    }, 300);
  });
};

export const getPopularRecipes = async (): Promise<RecipePreview[]> => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const popularRecipes = mockRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings
      }));
      
      resolve(popularRecipes);
    }, 500);
  });
};