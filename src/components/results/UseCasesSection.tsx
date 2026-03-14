import { Lang, UseCase } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'

const complexityColors = {
  'quick-win': 'green' as const,
  'medium': 'yellow' as const,
  'advanced': 'fucsia' as const,
}

export function UseCasesSection({ useCases, lang }: { useCases: UseCase[]; lang: Lang }) {
  const dict = getDictionary(lang)

  return (
    <div className="animate-fade-up">
      <h2 className="text-xl font-bold mb-4">{t(dict, 'results.useCasesTitle')}</h2>
      <div className="space-y-4">
        {useCases.map((uc, i) => (
          <div key={i} className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-text-primary">{uc.title}</h3>
              <Badge color={complexityColors[uc.complexity]}>
                {t(dict, `results.complexity.${uc.complexity}`)}
              </Badge>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">{uc.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg">
                <span className="text-green-400 font-semibold">{uc.weeklyHoursSaved}</span>
                <span className="text-text-muted">{t(dict, 'results.hoursSaved')}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg">
                <span className="text-fucsia font-semibold">{uc.monthlyROI}</span>
                <span className="text-text-muted">{t(dict, 'results.monthlyRoi')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
