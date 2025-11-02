'use client'

import { motion } from 'framer-motion'
import { Recipe } from '@/types'
import Link from 'next/link'

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

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-primary-blue"
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
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
