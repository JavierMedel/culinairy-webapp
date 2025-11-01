'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RecipeDetail } from '@/types'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return 'https://via.placeholder.com/800x450?text=Recipe'

  const url = imagePath.startsWith('http')
    ? imagePath
    : `${BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`

  // Print the final URL to the console
  console.log('Recipe image URL:', url)
  return url
}

export default function RecipeDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recipeId, setRecipeId] = useState<string>('')

  // Handle async params for Next.js 14
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = params instanceof Promise ? await params : params
      setRecipeId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!recipeId) return

    const fetchRecipe = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch recipe from /recipe/{id} endpoint
        const response = await fetch(`${BASE_URL}/recipe/${recipeId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipe')
        }
        
        const data = await response.json()
        console.log('Recipe data received:', data)
        setRecipe(data)
      } catch (err) {
        console.error('Error fetching recipe:', err)
        setError('Failed to load recipe details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [recipeId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-600 font-medium">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 font-medium mb-6">{error || 'Recipe not found'}</p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary-blue text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-white text-primary-blue rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow border-2 border-primary-blue"
            >
              ← Back to Recipes
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Recipe Image */}
          {(recipe.dishImage || recipe.image) && (
            <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
              <img
                src={getImageUrl(recipe.dishImage || recipe.image)}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/800x450?text=Recipe'
                }}
              />
            </div>
          )}

          {/* Recipe Content */}
          <div className="p-8 md:p-12">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-2"
            >
              {recipe.title}
            </motion.h1>

            {recipe.subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-xl text-gray-500 mb-4"
              >
                {recipe.subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-16 h-1 bg-gradient-to-r from-primary-blue to-blue-400 mb-6 rounded-full"
            ></motion.div>

            {recipe.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {recipe.description}
                </p>
              </motion.div>
            )}

            {/* Ingredients Section */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200 hover:border-primary-blue transition-colors"
                    >
                      {ingredient.image && (
                        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-2 bg-white">
                          <img
                            src={getImageUrl(ingredient.image)}
                            alt={ingredient.name || 'Ingredient'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://via.placeholder.com/100?text=Ingredient'
                            }}
                          />
                        </div>
                      )}
                      {ingredient.name && (
                        <p className="text-sm font-medium text-gray-700">{ingredient.name}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Cooking Steps Section */}
            {(recipe.cookingSteps || recipe.steps) && (recipe.cookingSteps || recipe.steps)!.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Cooking Steps</h2>
                <div className="space-y-6">
                  {(recipe.cookingSteps || recipe.steps)!.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex flex-col md:flex-row gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-primary-blue transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {step.stepNumber !== undefined ? step.stepNumber : index + 1}
                          </div>
                          <div className="flex-1">
                            {step.instruction && (
                              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {step.instruction}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {step.image && (
                        <div className="flex-shrink-0 w-full md:w-64 h-48 md:h-auto md:aspect-video overflow-hidden rounded-xl bg-white">
                          <img
                            src={getImageUrl(step.image)}
                            alt={`Step ${step.stepNumber !== undefined ? step.stepNumber : index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'https://via.placeholder.com/400x225?text=Step'
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex gap-4 pt-8 border-t border-gray-200"
            >
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
