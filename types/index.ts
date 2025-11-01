export interface Recipe {
  id: string
  name: string
  description: string
  image: string
}

export interface QueryResponse {
  recipes: Recipe[]
}

