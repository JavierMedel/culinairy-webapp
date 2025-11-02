'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

interface ChatBoxProps {
  onQuery: (query: string) => Promise<void>
  isLoading: boolean
}

export default function ChatBox({ onQuery, isLoading }: ChatBoxProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      await onQuery(query.trim())
      setQuery('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-2xl mx-auto px-4 mb-12"
    >
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me for a recipe..."
          disabled={isLoading}
          className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-blue focus:outline-none text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <motion.button
          type="submit"
          disabled={isLoading || !query.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-primary-blue text-white rounded-2xl font-semibold text-lg shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              Searching...
            </span>
          ) : (
            'Ask'
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}

