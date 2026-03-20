'use client'

import { useEffect, useState } from 'react'
import { Lang } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'

interface LoadingStateProps {
  lang: Lang
  error?: string | null
  onRetry?: () => void
}

export function LoadingState({ lang, error, onRetry }: LoadingStateProps) {
  const dict = getDictionary(lang)
  const steps = [
    t(dict, 'loading.step1'),
    t(dict, 'loading.step2'),
    t(dict, 'loading.step3'),
    t(dict, 'loading.step4'),
  ]
  const [activeStep, setActiveStep] = useState(0)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (error) return
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 2500)
    return () => clearInterval(interval)
  }, [steps.length, error])

  // 90s client-side timeout
  useEffect(() => {
    if (error) return
    const timer = setTimeout(() => setTimedOut(true), 90000)
    return () => clearTimeout(timer)
  }, [error])

  const displayError = error || (timedOut
    ? (lang === 'es' ? 'El análisis está tardando más de lo esperado.' : 'The analysis is taking longer than expected.')
    : null)

  if (displayError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-4xl mb-6">⚠️</div>
        <h2 className="text-xl font-bold mb-3 text-text-primary">{displayError}</h2>
        {onRetry && (
          <Button onClick={onRetry} className="mt-4">
            {lang === 'es' ? 'Reintentar' : 'Try again'}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Animated dots */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-fucsia"
            style={{
              animation: 'pulse-dot 1.4s infinite ease-in-out both',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-8">{t(dict, 'loading.title')}</h2>

      <div className="space-y-4 max-w-sm">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 transition-all duration-500 ${
              i <= activeStep ? 'opacity-100' : 'opacity-30'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              i < activeStep ? 'bg-green-500' : i === activeStep ? 'bg-fucsia animate-pulse' : 'bg-dark-600'
            }`}>
              {i < activeStep ? (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-white/50" />
              )}
            </div>
            <span className="text-sm text-text-secondary">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
