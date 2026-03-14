'use client'

import Link from 'next/link'
import { Lang } from '@/lib/types'

export function Header({ lang }: { lang: Lang }) {
  const otherLang = lang === 'es' ? 'en' : 'es'

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <span className="text-xl font-bold text-text-primary">
            Krush<span className="text-fucsia">Media</span>
          </span>
        </Link>
        <Link
          href={`/${otherLang}`}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg border border-dark-600 hover:border-dark-400"
        >
          {otherLang.toUpperCase()}
        </Link>
      </div>
    </header>
  )
}
