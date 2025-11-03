'use client'

import { motion } from 'framer-motion'
import { Recipe } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { useShoppingList } from '@/store/shoppingList'
import { useToast } from '@/components/ToastProvider'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// Helper function to get the correct image URL
const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return 'https://via.placeholder.com/400x225?text=Recipe'
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  if (imagePath.startsWith('/')) return `${BASE_URL}${imagePath}`
  return `${BASE_URL}/${imagePath}`
}

interface RecipeCardProps {
  recipe: Recipe
  index: number
}

export default function RecipeCard({ recipe, index }: RecipeCardProps) {
  const title = recipe.title || 'Untitled Recipe'
  const description = recipe.description || 'No description available'
  // Prioritize dish_image_url over image
  const imageUrl = (recipe as any).dish_image_url || recipe.image || ''
  const { addRecipe, isInList } = useShoppingList()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToShoppingList = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInList(recipe.id)) {
      showToast(`${title} is already in your shopping list`, 'info')
      return
    }

    setIsAdding(true)
    setIsLoading(true)

    try {
      // Fetch full recipe details to get ingredients
      const response = await fetch(`${BASE_URL}/recipe/${recipe.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details')
      }

      const recipeDetail = await response.json()
      const ingredients = recipeDetail.ingredients || []

      // Map ingredients to shopping list format
      const shoppingListIngredients = ingredients.map((ing: any) => ({
        name: ing.name || '',
        quantity: ing.quantity || '',
      }))

      // Add to shopping list
      addRecipe({
        id: recipe.id,
        title: recipeDetail.title || recipeDetail.name || title,
        ingredients: shoppingListIngredients,
      })

      showToast(`✅ Added ${recipeDetail.title || recipeDetail.name || title} to shopping list`)
    } catch (error) {
      console.error('Error adding to shopping list:', error)
      showToast('Failed to add recipe to shopping list', 'error')
    } finally {
      setIsLoading(false)
      setIsAdding(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-200 dark:border-gray-700 hover:border-primary-blue">
      <Link href={`/recipe/${recipe.id}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="cursor-pointer"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={getImageUrl(imageUrl)}
              alt={title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://via.placeholder.com/400x225?text=Recipe'
              }}
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
              {description}
            </p>
            
            {/* Recipe Metadata */}
            {(recipe.total_time || recipe.servings || recipe.difficulty || recipe.calories_per_serving) && (
              <div className="flex flex-wrap gap-3 mb-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                {recipe.total_time && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{recipe.total_time}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{recipe.servings}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>{recipe.difficulty}</span>
                  </div>
                )}
                {recipe.calories_per_serving && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{recipe.calories_per_serving}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </Link>
      <div className="px-6 pb-6">
        <motion.button
          onClick={handleAddToShoppingList}
          disabled={isLoading || isInList(recipe.id)}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
            isInList(recipe.id)
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-primary-blue text-white hover:bg-blue-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Adding...
            </span>
          ) : isInList(recipe.id) ? (
            '✓ Already in Shopping List'
          ) : (
            '🛒 Add to Shopping List'
          )}
        </motion.button>
      </div>
    </div>
  )
}
