import { Lang, ActionItem } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'

export function ActionPlanSection({ actionItems, lang }: { actionItems: ActionItem[]; lang: Lang }) {
  if (!actionItems?.length) return null
  const dict = getDictionary(lang)

  return (
    <div className="animate-fade-up">
      <h2 className="text-xl font-bold mb-4">{t(dict, 'results.actionPlanTitle')}</h2>
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 space-y-6">
        {actionItems.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-fucsia/10 text-fucsia text-sm font-bold flex items-center justify-center">
              {item.priority}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-text-primary text-sm">{item.action}</h3>
                <span className="text-xs text-text-muted whitespace-nowrap px-2 py-1 bg-dark-700 rounded">
                  {item.timeframe}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{item.expectedImpact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
