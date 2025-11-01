'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/types'
import Header from '@/components/Header'
import ChatBox from '@/components/ChatBox'
import RecipeGrid from '@/components/RecipeGrid'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Load default recipes on mount
  useEffect(() => {
    const fetchDefaultRecipes = async () => {
      try {
        setInitialLoading(true)
        const response = await fetch(`${BASE_URL}/recipes?limit=9`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes')
        }
        
        const data = await response.json()
        setRecipes(data)
      } catch (error) {
        console.error('Error fetching default recipes:', error)
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
          image: recipe.dishImage || recipe.image || '',
        }))

      setRecipes(validRecipes)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-600 font-medium">Loading recipes...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Header />
        <ChatBox onQuery={handleQuery} isLoading={loading} />
        <RecipeGrid recipes={recipes} />
      </div>
    </main>
  )
}

