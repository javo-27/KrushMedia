'use client'

import { Lang } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'

interface CategoryBreakdownProps {
  scores: Record<string, { raw: number; normalized: number; label: string }>
  lang: Lang
}

const categoryIcons: Record<string, string> = {
  marketing: '📢',
  sales: '💼',
  operations: '⚙️',
  customerExperience: '🤝',
  dataAnalytics: '📊',
}

function barColor(score: number): string {
  if (score <= 40) return 'bg-red-500'
  if (score <= 60) return 'bg-yellow-500'
  if (score <= 80) return 'bg-green-500'
  return 'bg-fucsia'
}

export function CategoryBreakdown({ scores, lang }: CategoryBreakdownProps) {
  const dict = getDictionary(lang)

  return (
    <div className="animate-fade-up animate-fade-up-delay-2">
      <h2 className="text-xl font-bold mb-4">{t(dict, 'results.categoriesTitle')}</h2>
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-6">
        {Object.entries(scores).map(([key, data]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span>{categoryIcons[key]}</span>
                <span className="text-sm font-medium">
                  {t(dict, `categories.${key}`)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-muted">{data.label}</span>
                <span className="text-sm font-bold">{data.normalized}/100</span>
              </div>
            </div>
            <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor(data.normalized)}`}
                style={{ width: `${data.normalized}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
