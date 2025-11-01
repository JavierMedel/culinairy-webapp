'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RecipeDetail } from '@/types'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return 'https://via.placeholder.com/800x450?text=Recipe'
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Handle paths that start with /images/ or just images/
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${BASE_URL}${normalizedPath}`
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
        const response = await fetch(`${BASE_URL}/recipe/${recipeId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipe')
        }
        
        const data = await response.json()
        console.log('Recipe data received:', data)
        console.log('dish_image_url:', data.dish_image_url)
        console.log('dishImage:', data.dishImage)
        console.log('image:', data.image)
        console.log('cookingSteps:', data.cookingSteps)
        console.log('steps:', data.steps)
        console.log('cooking_steps:', data.cooking_steps)
        console.log('ingredients:', data.ingredients)
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-300 font-medium">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-300 font-medium mb-6">{error || 'Recipe not found'}</p>
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
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gray-800 text-white rounded-full font-semibold shadow-md hover:bg-gray-700 transition-colors border border-gray-700"
            >
              ← Back to Recipes
            </motion.button>
          </Link>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Recipe Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            {(() => {
              const dishImage = (recipe as any).dish_image_url || recipe.dishImage || recipe.image || ''
              return dishImage ? (
                <div className="relative w-full aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden bg-gray-800 shadow-2xl">
                  <img
                    src={getImageUrl(dishImage)}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://via.placeholder.com/800x800?text=Recipe'
                    }}
                  />
                </div>
              ) : null
            })()}
          </motion.div>

          {/* Right Column - Recipe Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {/* Title */}
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3">
              {recipe.title}
            </h1>

            {/* Subtitle */}
            {recipe.subtitle && (
              <p className="text-xl text-gray-400 mb-6">
                {recipe.subtitle}
              </p>
            )}

            {/* Description Box */}
            {recipe.description && (
              <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-700">
                <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {recipe.description}
                </p>
              </div>
            )}

            {/* Stats/Metadata */}
            {(recipe.totalTime || recipe.prepTime || recipe.cookTime || recipe.calories) && (
              <div className="flex flex-wrap gap-6 mb-6 text-gray-300">
                {recipe.totalTime && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{recipe.totalTime} minutes</span>
                  </div>
                )}
                {recipe.prepTime && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Prep: {recipe.prepTime} min</span>
                  </div>
                )}
                {recipe.calories && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{recipe.calories} kcal</span>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Ingredients Section */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Ingredients</h2>
            <div className="flex flex-wrap gap-4">
              {recipe.ingredients.map((ingredient: any, index) => {
                const ingredientImage = ingredient.image_url || ingredient.image || ''
                return (
                  <motion.div
                    key={ingredient.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="bg-gray-800 rounded-2xl p-4 border border-gray-700 hover:border-primary-blue transition-colors"
                  >
                    {ingredientImage && (
                      <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden mb-3 bg-gray-700">
                        <img
                          src={getImageUrl(ingredientImage)}
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
                      <p className="text-sm font-medium text-gray-300 text-center whitespace-nowrap">
                        {ingredient.name}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Cooking Steps Section */}
        {(() => {
          const steps = (recipe as any).cooking_steps || recipe.cookingSteps || recipe.steps || []
          return steps.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Cooking Steps</h2>
              <div className="space-y-6">
                {steps.map((step: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                          {step.step_number !== undefined ? step.step_number : (step.stepNumber !== undefined ? step.stepNumber : index + 1)}
                        </div>
                        <div className="flex-1">
                          {(step.instruction || step.text || step.description) && (
                            <p className="text-lg text-gray-200 leading-relaxed whitespace-pre-wrap">
                              {step.instruction || step.text || step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {(step.image || step.image_url || step.step_image) && (
                      <div className="flex-shrink-0 w-full md:w-80 h-48 md:h-auto md:aspect-video overflow-hidden rounded-xl bg-gray-700">
                        <img
                          src={getImageUrl(step.image_url || step.step_image || step.image)}
                          alt={`Step ${step.step_number !== undefined ? step.step_number : (step.stepNumber !== undefined ? step.stepNumber : index + 1)}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://via.placeholder.com/400x225?text=Step'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              </div>
            </motion.div>
          ) : null
        })()}
      </div>
    </main>
  )
}
