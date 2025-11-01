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
      const response = await fetch(`${BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes || [])
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

