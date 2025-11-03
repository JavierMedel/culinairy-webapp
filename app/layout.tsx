import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ToastProvider'
import NavigationHeader from '@/components/NavigationHeader'

export const metadata: Metadata = {
  title: 'CulinAIry Agent — The Intelligent Kitchen Agent - Effortless AI Meal Planning',
  description: 'AI-powered meal planning with personalized recipe suggestions. Picture It. Cook It. Enjoy It.',
  icons: {
    icon: '/knife_favicon.png',
    shortcut: '/knife_favicon.png',
    apple: '/knife_favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <NavigationHeader />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

