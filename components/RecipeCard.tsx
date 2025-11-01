'use client'

import { motion } from 'framer-motion'
import { Recipe } from '@/types'

interface RecipeCardProps {
  recipe: Recipe
  index: number
}

export default function RecipeCard({ recipe, index }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://via.placeholder.com/400x225?text=Recipe'
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {recipe.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {recipe.description}
        </p>
      </div>
    </motion.div>
  )
}

