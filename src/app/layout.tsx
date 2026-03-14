import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Readiness Score | Krush Media',
  description: 'Discover how AI-ready your business is. Free 5-minute assessment with a personalized report.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-dark-900 text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
