import Link from 'next/link'
import { Lang } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang = langParam as Lang
  const dict = getDictionary(lang)

  return (
    <>
      <Header lang={lang} />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fucsia/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fucsia/10 border border-fucsia/20 text-fucsia text-sm font-medium">
              {t(dict, 'landing.badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {t(dict, 'landing.headline')}
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {t(dict, 'landing.subheadline')}
            </p>

            <div className="flex flex-col items-center gap-3">
              <Link
                href={`/${lang}/evaluacion`}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-fucsia hover:bg-fucsia-dark text-white shadow-lg shadow-fucsia/20 transition-all duration-200"
              >
                {t(dict, 'landing.cta')}
              </Link>
              <span className="text-sm text-text-muted">{t(dict, 'landing.ctaSub')}</span>
            </div>

            {/* Animated score preview */}
            <div className="pt-8">
              <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-dark-800 border border-dark-600">
                <svg width="60" height="60" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-dark-600" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6"
                    className="text-fucsia"
                    strokeDasharray="264"
                    strokeDashoffset="92"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" className="fill-text-primary text-xl font-bold" fontSize="24">65</text>
                </svg>
                <div className="text-left">
                  <div className="text-sm text-text-muted">{lang === 'es' ? 'Ejemplo de score' : 'Score example'}</div>
                  <div className="text-lg font-semibold text-text-primary">{lang === 'es' ? 'En Desarrollo' : 'Developing'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">{t(dict, 'landing.howItWorksTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: '01', title: t(dict, 'landing.step1Title'), desc: t(dict, 'landing.step1Desc'), icon: '🏢' },
                { num: '02', title: t(dict, 'landing.step2Title'), desc: t(dict, 'landing.step2Desc'), icon: '📋' },
                { num: '03', title: t(dict, 'landing.step3Title'), desc: t(dict, 'landing.step3Desc'), icon: '🤖' },
              ].map((step) => (
                <div key={step.num} className="relative bg-dark-800 border border-dark-600 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="text-fucsia text-sm font-bold mb-2">{step.num}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-text-secondary">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 px-4 bg-dark-800/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">{t(dict, 'landing.benefitsTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: t(dict, 'landing.benefit1Title'), desc: t(dict, 'landing.benefit1Desc'), icon: '📊' },
                { title: t(dict, 'landing.benefit2Title'), desc: t(dict, 'landing.benefit2Desc'), icon: '🔍' },
                { title: t(dict, 'landing.benefit3Title'), desc: t(dict, 'landing.benefit3Desc'), icon: '🎯' },
              ].map((benefit) => (
                <div key={benefit.title} className="bg-dark-800 border border-dark-600 rounded-2xl p-8">
                  <div className="text-3xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">{t(dict, 'landing.finalCta')}</h2>
            <Link
              href={`/${lang}/evaluacion`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-fucsia hover:bg-fucsia-dark text-white shadow-lg shadow-fucsia/20 transition-all duration-200"
            >
              {t(dict, 'landing.cta')}
            </Link>
            <p className="text-text-muted text-sm">
              {t(dict, 'landing.poweredBy')} Krush<span className="text-fucsia">Media</span>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
