import { Lang, Gap } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'

const impactColors = {
  high: 'red' as const,
  medium: 'yellow' as const,
  low: 'gray' as const,
}

export function GapsSection({ gaps, lang }: { gaps: Gap[]; lang: Lang }) {
  const dict = getDictionary(lang)

  return (
    <div className="animate-fade-up">
      <h2 className="text-xl font-bold mb-4">{t(dict, 'results.gapsTitle')}</h2>
      <div className="space-y-4">
        {gaps.map((gap, i) => (
          <div key={i} className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-text-primary">{gap.gap}</h3>
              <Badge color={impactColors[gap.impact]}>
                {t(dict, `results.impact.${gap.impact}`)}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{gap.explanation}</p>
            <div className="mt-3">
              <span className="text-xs text-text-muted">{gap.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
