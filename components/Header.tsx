'use client'

import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12 px-4"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        <span className="text-primary-blue">CulinAIry Agent</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
        The Intelligent Kitchen Agent. Picture It. Cook It. Enjoy It.
      </p>
    </motion.header>
  )
}

