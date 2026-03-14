'use client'

import { useEffect, useState } from 'react'
import { Lang, IndustryBenchmark } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'

interface ScoreHeroProps {
  score: number
  maturityLabel: string
  companyName: string
  benchmark: IndustryBenchmark
  lang: Lang
}

export function ScoreHero({ score, maturityLabel, companyName, benchmark, lang }: ScoreHeroProps) {
  const dict = getDictionary(lang)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let frame: number
    const duration = 1500
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  // SVG circle calculations
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  const scoreColor = score <= 40 ? '#ef4444' : score <= 60 ? '#eab308' : score <= 80 ? '#22c55e' : '#EC1F5E'

  return (
    <div className="text-center animate-fade-up">
      <h1 className="text-3xl font-bold mb-8">{t(dict, 'results.title')}</h1>

      {/* Score gauge */}
      <div className="inline-flex flex-col items-center">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Background circle */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-dark-600"
          />
          {/* Score circle */}
          <circle
            cx="110" cy="110" r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />
          {/* Score text */}
          <text x="110" y="100" textAnchor="middle" className="fill-text-primary" fontSize="48" fontWeight="800">
            {animatedScore}
          </text>
          <text x="110" y="125" textAnchor="middle" className="fill-text-muted" fontSize="14">
            /100
          </text>
        </svg>

        {/* Maturity label */}
        <div className="mt-4">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold border"
            style={{ borderColor: scoreColor, color: scoreColor, backgroundColor: `${scoreColor}15` }}
          >
            {maturityLabel}
          </span>
        </div>

        {/* Company name */}
        <p className="mt-4 text-text-secondary">{companyName}</p>

        {/* Benchmark */}
        <div className="mt-4 px-6 py-3 bg-dark-800 rounded-xl border border-dark-600 text-sm text-text-secondary">
          {benchmark.percentileRank}
        </div>
      </div>
    </div>
  )
}
