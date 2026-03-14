'use client'

import { Question, Lang } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'

interface QuestionRendererProps {
  question: Question
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
  questionNumber: number
  lang: Lang
}

export function QuestionRenderer({ question, value, onChange, questionNumber, lang }: QuestionRendererProps) {
  const dict = getDictionary(lang)

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-fucsia/10 text-fucsia text-sm font-bold flex items-center justify-center">
          {questionNumber}
        </span>
        <div>
          <h3 className="font-medium text-text-primary leading-snug">{question.text}</h3>
          {!question.isScored && (
            <span className="text-xs text-text-muted mt-1 inline-block">
              {t(dict, 'assessment.optional')}
            </span>
          )}
        </div>
      </div>

      {question.type === 'select' && question.options && (
        <div className="space-y-2">
          {question.options.map(opt => {
            const selected = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  selected
                    ? 'border-fucsia bg-fucsia/10 text-text-primary'
                    : 'border-dark-500 bg-dark-700 text-text-secondary hover:border-dark-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                    selected ? 'border-fucsia bg-fucsia' : 'border-dark-400'
                  }`}>
                    {selected && <div className="w-full h-full rounded-full bg-fucsia" />}
                  </div>
                  <span className="text-sm">{opt.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'multi-select' && question.options && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted mb-3">{t(dict, 'assessment.selectMultiple')}</p>
          {question.options.map(opt => {
            const selected = Array.isArray(value) && value.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const current = (Array.isArray(value) ? value : []) as string[]
                  if (selected) {
                    onChange(current.filter(v => v !== opt.value))
                  } else {
                    onChange([...current, opt.value])
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  selected
                    ? 'border-fucsia bg-fucsia/10 text-text-primary'
                    : 'border-dark-500 bg-dark-700 text-text-secondary hover:border-dark-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                    selected ? 'border-fucsia bg-fucsia' : 'border-dark-400'
                  }`}>
                    {selected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{opt.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'textarea' && (
        <div>
          <textarea
            rows={3}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-fucsia focus:ring-1 focus:ring-fucsia transition-colors resize-none text-sm"
          />
          <p className="text-xs text-text-muted mt-1.5">{t(dict, 'assessment.freeformHint')}</p>
        </div>
      )}
    </div>
  )
}
