export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  dish_image_url?: string
}

export interface CookingStep {
  stepNumber?: number
  instruction?: string
  image?: string
  [key: string]: any
}

export interface RecipeDetail extends Recipe {
  subtitle?: string
  prepTime?: number
  cookTime?: number
  totalTime?: number
  calories?: number
  tags?: string[]
  ingredients?: Array<{
    id?: string
    name?: string
    image?: string
    image_url?: string
    quantity?: string
    allergens?: string[]
    [key: string]: any
  }>
  dishImage?: string
  dish_image_url?: string
  cookingSteps?: CookingStep[]
  steps?: CookingStep[]
  cooking_steps?: CookingStep[]
  [key: string]: any
}

export interface QueryResponse {
  recipes: Recipe[]
}

export interface SearchRecipesResponse {
  query: string
  count: number
  recipe_ids: string[]
}

