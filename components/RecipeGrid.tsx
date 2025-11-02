'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Recipe } from '@/types'
import RecipeCard from './RecipeCard'

interface RecipeGridProps {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 px-4"
      >
        <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
          No recipes found. Try another query!
        </p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={recipes.length}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12"
      >
        {recipes.map((recipe, index) => (
          <RecipeCard key={recipe.id} recipe={recipe} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

