import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ShoppingListIngredient {
  name: string
  quantity?: string
}

export interface ShoppingListRecipe {
  id: string
  title: string
  ingredients: ShoppingListIngredient[]
}

interface ShoppingListState {
  recipes: {
    [recipeId: string]: ShoppingListRecipe
  }
  addRecipe: (recipe: ShoppingListRecipe) => void
  removeRecipe: (recipeId: string) => void
  clearList: () => void
  isInList: (recipeId: string) => boolean
}

export const useShoppingList = create<ShoppingListState>()(
  persist(
    (set, get) => ({
      recipes: {},
      addRecipe: (recipe) => {
        set((state) => ({
          recipes: {
            ...state.recipes,
            [recipe.id]: recipe,
          },
        }))
      },
      removeRecipe: (recipeId) => {
        set((state) => {
          const { [recipeId]: removed, ...rest } = state.recipes
          return { recipes: rest }
        })
      },
      clearList: () => {
        set({ recipes: {} })
      },
      isInList: (recipeId) => {
        return recipeId in get().recipes
      },
    }),
    {
      name: 'shopping-list-storage',
    }
  )
)

