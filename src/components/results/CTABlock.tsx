import { Lang } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'

export function CTABlock({ lang }: { lang: Lang }) {
  const dict = getDictionary(lang)
  const bookingUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '#'

  return (
    <div className="bg-gradient-to-br from-fucsia/10 to-dark-800 border border-fucsia/20 rounded-2xl p-8 text-center animate-fade-up">
      <h2 className="text-2xl font-bold mb-3">{t(dict, 'results.ctaTitle')}</h2>
      <p className="text-text-secondary mb-6">{t(dict, 'results.ctaSubtitle')}</p>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-fucsia hover:bg-fucsia-dark text-white shadow-lg shadow-fucsia/20 transition-all duration-200"
      >
        {t(dict, 'results.ctaButton')}
      </a>
      <p className="mt-6 text-sm text-text-muted">
        Powered by Krush<span className="text-fucsia">Media</span>
      </p>
    </div>
  )
}
