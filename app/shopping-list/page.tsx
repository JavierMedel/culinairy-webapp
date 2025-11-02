'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useShoppingList } from '@/store/shoppingList'

export default function ShoppingListPage() {
  const { recipes, removeRecipe, clearList } = useShoppingList()
  const recipeList = Object.values(recipes)

  const handleRemoveRecipe = (recipeId: string, title: string) => {
    removeRecipe(recipeId)
  }

  const handleClearAll = () => {
    if (recipeList.length === 0) return
    if (window.confirm('Are you sure you want to clear the entire shopping list?')) {
      clearList()
    }
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">Shopping List</h1>
            <motion.button
              onClick={handleClearAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
            >
              Clear All
            </motion.button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {recipeList.length} {recipeList.length === 1 ? 'recipe' : 'recipes'} in your list
          </p>
        </motion.div>

        {/* Recipe Cards */}
        <div className="space-y-6">
          <AnimatePresence>
            {recipeList.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
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

