import { Lang } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'

export function ExecutiveSummary({ text, lang }: { text: string; lang: Lang }) {
  const dict = getDictionary(lang)

  return (
    <div className="animate-fade-up animate-fade-up-delay-1">
      <h2 className="text-xl font-bold mb-4">{t(dict, 'results.summaryTitle')}</h2>
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
        <div className="prose prose-invert prose-sm max-w-none">
          {text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-text-secondary leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
