import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CulinAIry Agent — The Intelligent Kitchen Agent - Effortless AI Meal Planning',
  description: 'AI-powered meal planning with personalized recipe suggestions. Picture It. Cook It. Enjoy It.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

