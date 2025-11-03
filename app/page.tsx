'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Recipe } from '@/types'
import Header from '@/components/Header'
import ChatBox from '@/components/ChatBox'
import RecipeGrid from '@/components/RecipeGrid'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isSearchMode, setIsSearchMode] = useState(false)

  // Load default recipes on mount
  useEffect(() => {
    const fetchDefaultRecipes = async () => {
      try {
        setInitialLoading(true)
        console.log('Fetching recipes from:', `${BASE_URL}/recipes?limit=9`)
        const response = await fetch(`${BASE_URL}/recipes?limit=9`)
        
        if (!response.ok) {
          console.error('Response not OK:', response.status, response.statusText)
          throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Received data:', data)
        
        // Handle different response formats
        let recipeArray = []
        if (Array.isArray(data)) {
          recipeArray = data
        } else if (data.recipes && Array.isArray(data.recipes)) {
          recipeArray = data.recipes
        } else if (data.data && Array.isArray(data.data)) {
          recipeArray = data.data
        } else {
          console.warn('Unexpected response format:', data)
          recipeArray = []
        }
        
        // Map recipes to ensure dish_image_url is available
        const mappedRecipes = recipeArray.map((recipe: any) => ({
          id: recipe.id || recipe._id || Math.random().toString(),
          title: recipe.title || recipe.name || 'Untitled Recipe',
          description: recipe.description || '',
          image: recipe.dish_image_url || recipe.dishImage || recipe.image || '',
          dish_image_url: recipe.dish_image_url || recipe.dishImage || recipe.image || '',
          total_time: recipe.total_time || recipe.totalTime || '',
          servings: recipe.servings || '',
          difficulty: recipe.difficulty || '',
          calories_per_serving: recipe.calories_per_serving || recipe.caloriesPerServing || '',
        }))
        
        console.log('Mapped recipes:', mappedRecipes)
        setRecipes(mappedRecipes)
        setPage(1)
        setIsSearchMode(false)
        setHasMore(mappedRecipes.length >= 9)
      } catch (error: any) {
        console.error('Error fetching default recipes:', error)
        // Show more details in console
        if (error.message) {
          console.error('Error message:', error.message)
        }
        // Set empty array on error to show no recipes message
        setRecipes([])
      } finally {
        setInitialLoading(false)
      }
    }

    fetchDefaultRecipes()
  }, [])

  // Handle user query
  const handleQuery = async (query: string) => {
    setLoading(true)
    try {
      // Step 1: Search for recipes
      const searchResponse = await fetch(`${BASE_URL}/search-recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          top_k: 3 
        }),
      })

      if (!searchResponse.ok) {
        throw new Error('Failed to search recipes')
      }

      const searchData = await searchResponse.json()
      const { recipe_ids } = searchData

      // Step 2: Fetch full recipe details for each recipe ID
      const recipePromises = recipe_ids.map((recipeId: string) =>
        fetch(`${BASE_URL}/recipe/${recipeId}`)
          .then((res) => {
            if (!res.ok) {
              console.error(`Failed to fetch recipe ${recipeId}`)
              return null
            }
            return res.json()
          })
          .catch((error) => {
            console.error(`Error fetching recipe ${recipeId}:`, error)
            return null
          })
      )

      const recipeResults = await Promise.all(recipePromises)
      
      // Filter out null results and map to Recipe format
      const validRecipes = recipeResults
        .filter((recipe) => recipe !== null)
        .map((recipe) => ({
          id: recipe.id,
          title: recipe.title || recipe.name || '',
          description: recipe.description || '',
          image: recipe.dish_image_url || recipe.dishImage || recipe.image || '',
          dish_image_url: recipe.dish_image_url || recipe.dishImage || recipe.image || '',
          total_time: recipe.total_time || recipe.totalTime || '',
          servings: recipe.servings || '',
          difficulty: recipe.difficulty || '',
          calories_per_serving: recipe.calories_per_serving || recipe.caloriesPerServing || '',
        }))

      setRecipes(validRecipes)
      setIsSearchMode(true)
      setHasMore(false)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  // Handle load more recipes
  const handleLoadMore = async () => {
    if (isSearchMode || !hasMore || loadingMore) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`${BASE_URL}/recipes?limit=9&offset=${page * 9}`)
      
      if (!response.ok) {
        throw new Error('Failed to load more recipes')
      }
      
      const data = await response.json()
      let recipeArray = []
      if (Array.isArray(data)) {
        recipeArray = data
      } else if (data.recipes && Array.isArray(data.recipes)) {
        recipeArray = data.recipes
      } else if (data.data && Array.isArray(data.data)) {
        recipeArray = data.data
      }
      
      if (recipeArray.length === 0) {
        setHasMore(false)
        return
      }
      
      const mappedRecipes = recipeArray.map((recipe: any) => ({
        id: recipe.id || recipe._id || Math.random().toString(),
        title: recipe.title || recipe.name || 'Untitled Recipe',
        description: recipe.description || '',
        image: recipe.dish_image_url || recipe.dishImage || recipe.image || '',
        dish_image_url: recipe.dish_image_url || recipe.dishImage || recipe.image || '',
        total_time: recipe.total_time || recipe.totalTime || '',
        servings: recipe.servings || '',
        difficulty: recipe.difficulty || '',
        calories_per_serving: recipe.calories_per_serving || recipe.caloriesPerServing || '',
      }))
      
      setRecipes((prev) => [...prev, ...mappedRecipes])
      setPage(nextPage)
      setHasMore(mappedRecipes.length >= 9)
    } catch (error) {
      console.error('Error loading more recipes:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Loading recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <Header />
        <ChatBox onQuery={handleQuery} isLoading={loading} />
        <RecipeGrid recipes={recipes} />
        {!isSearchMode && hasMore && recipes.length > 0 && (
          <div className="flex justify-center px-4 pb-12">
            <motion.button
              onClick={handleLoadMore}
              disabled={loadingMore}
              whileHover={{ scale: loadingMore ? 1 : 1.05 }}
              whileTap={{ scale: loadingMore ? 1 : 0.95 }}
              className="px-8 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Load More Recipes'
              )}
            </motion.button>
          </div>
        )}
      </div>
    </main>
  )
}

