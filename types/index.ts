export interface Recipe {
  id: string
  title: string
  description: string
  image: string
}

export interface CookingStep {
  stepNumber?: number
  instruction?: string
  image?: string
  [key: string]: any
}

export interface RecipeDetail extends Recipe {
  subtitle?: string
  ingredients?: Array<{
    id?: string
    name?: string
    image?: string
    [key: string]: any
  }>
  dishImage?: string
  cookingSteps?: CookingStep[]
  steps?: CookingStep[]
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

