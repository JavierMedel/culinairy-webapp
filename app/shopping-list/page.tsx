'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useShoppingList, ShoppingListIngredient } from '@/store/shoppingList'
import { useToast } from '@/components/ToastProvider'

type GroupByMode = 'recipe' | 'ingredient'

interface GroupedIngredient {
  name: string
  quantities: string[]
  recipes: string[]
}

export default function ShoppingListPage() {
  const { recipes, removeRecipe, clearList } = useShoppingList()
  const { showToast } = useToast()
  const recipeList = Object.values(recipes)
  const [groupBy, setGroupBy] = useState<GroupByMode>('recipe')

  const handleRemoveRecipe = (recipeId: string, title: string) => {
    removeRecipe(recipeId)
  }

  const handleClearAll = () => {
    if (recipeList.length === 0) return
    if (window.confirm('Are you sure you want to clear the entire shopping list?')) {
      clearList()
    }
  }

  // Group ingredients by name
  const getGroupedIngredients = (): GroupedIngredient[] => {
    const ingredientMap = new Map<string, GroupedIngredient>()

    recipeList.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const normalizedName = ing.name.toLowerCase().trim()
        if (!ingredientMap.has(normalizedName)) {
          ingredientMap.set(normalizedName, {
            name: ing.name,
            quantities: [],
            recipes: [],
          })
        }
        const grouped = ingredientMap.get(normalizedName)!
        if (ing.quantity && !grouped.quantities.includes(ing.quantity)) {
          grouped.quantities.push(ing.quantity)
        }
        if (!grouped.recipes.includes(recipe.title)) {
          grouped.recipes.push(recipe.title)
        }
      })
    })

    return Array.from(ingredientMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }

  // Generate text format of shopping list
  const generateShoppingListText = (mode: GroupByMode): string => {
    if (mode === 'recipe') {
      return recipeList
        .map((recipe) => {
          const ingredients = recipe.ingredients
            .map((ing) => {
              const qty = ing.quantity ? ` (${ing.quantity})` : ''
              return `  • ${ing.name}${qty}`
            })
            .join('\n')
          return `🍽️ ${recipe.title}\n${ingredients}`
        })
        .join('\n\n')
    } else {
      const grouped = getGroupedIngredients()
      return grouped
        .map((ing) => {
          const quantities = ing.quantities.length > 0
            ? ` (${ing.quantities.join(', ')})`
            : ''
          const recipes = ing.recipes.length > 0
            ? `\n  Used in: ${ing.recipes.join(', ')}`
            : ''
          return `• ${ing.name}${quantities}${recipes}`
        })
        .join('\n')
    }
  }

  // Download shopping list as text file
  const handleDownload = () => {
    const text = generateShoppingListText(groupBy)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Shopping list downloaded successfully!')
  }

  // Share shopping list
  const handleShare = async () => {
    const text = generateShoppingListText(groupBy)
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Shopping List',
          text: text,
        })
        showToast('Shopping list shared successfully!')
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          handleCopyToClipboard(text)
        }
      }
    } else {
      // Fallback to clipboard
      handleCopyToClipboard(text)
    }
  }

  // Copy to clipboard fallback
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        showToast('Shopping list copied to clipboard!')
      },
      () => {
        showToast('Failed to copy shopping list', 'error')
      }
    )
  }

  if (recipeList.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Shopping List is Empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start adding recipes to your shopping list to see ingredients here!
            </p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Recipes
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h1 className="text-4xl font-bold">Shopping List</h1>
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 0C8.702 10.21 8.125 9.7 7.5 9.5c-.625-.2-1.25-.3-1.875-.3-.625 0-1.25.1-1.875.3-.625.2-1.202.71-1.684 1.158m0 0C1.886 11.062 2 11.518 2 12c0 .482.114.938.316 1.342m0 0C2.298 13.79 2.875 14.3 3.5 14.5c.625.2 1.25.3 1.875.3.625 0 1.25-.1 1.875-.3.625-.2 1.202-.71 1.684-1.158m0 0C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m-4.632 2.684c.625.2 1.25.3 1.875.3.625 0 1.25-.1 1.875-.3.625-.2 1.202-.71 1.684-1.158M15 12c0 .482-.114.938-.316 1.342m0 0C14.298 13.79 13.875 14.3 13.25 14.5c-.625.2-1.25.3-1.875.3-.625 0-1.25-.1-1.875-.3-.625-.2-1.202-.71-1.684-1.158m0 0C9.114 12.938 9 12.482 9 12c0-.482.114-.938.316-1.342" />
                </svg>
                Share
              </motion.button>
              <motion.button
                onClick={handleDownload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </motion.button>
              <motion.button
                onClick={handleClearAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
              >
                Clear All
              </motion.button>
            </div>
          </div>
          
          {/* Group By Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              {recipeList.length} {recipeList.length === 1 ? 'recipe' : 'recipes'} in your list
            </p>
            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setGroupBy('recipe')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  groupBy === 'recipe'
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                By Recipe
              </button>
              <button
                onClick={() => setGroupBy('ingredient')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                  groupBy === 'ingredient'
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                By Ingredient
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content based on groupBy mode */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {groupBy === 'recipe' ? (
              <motion.div
                key="recipe-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {recipeList.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {recipe.title}
                        </h2>
                        <Link href={`/recipe/${recipe.id}`}>
                          <span className="text-sm text-primary-blue hover:underline">
                            View Recipe →
                          </span>
                        </Link>
                      </div>
                      <motion.button
                        onClick={() => handleRemoveRecipe(recipe.id, recipe.title)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label={`Remove ${recipe.title} from shopping list`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Ingredients List */}
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                          Ingredients:
                        </h3>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ingredient, ingIndex) => (
                            <motion.li
                              key={ingIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 + ingIndex * 0.05 }}
                              className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                            >
                              <span className="text-primary-blue">•</span>
                              <span className="flex-1">
                                {ingredient.name}
                                {ingredient.quantity && (
                                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                                    ({ingredient.quantity})
                                  </span>
                                )}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No ingredients available for this recipe
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="ingredient-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Ingredients (Grouped)
                </h2>
                {getGroupedIngredients().length > 0 ? (
                  <ul className="space-y-4">
                    {getGroupedIngredients().map((ingredient, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-3 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                      >
                        <span className="text-primary-blue text-lg">•</span>
                        <div className="flex-1">
                          <span className="font-semibold text-base">{ingredient.name}</span>
                          {ingredient.quantities.length > 0 && (
                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                              ({ingredient.quantities.join(', ')})
                            </span>
                          )}
                          {ingredient.recipes.length > 0 && (
                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Used in: {ingredient.recipes.join(', ')}
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No ingredients available
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Back to Recipes
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

