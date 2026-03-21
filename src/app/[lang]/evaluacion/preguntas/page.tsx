'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAssessment } from '@/lib/context/AssessmentContext'
import { getDictionary, t } from '@/lib/i18n'
import { Lang } from '@/lib/types'
import { categories as esCategories } from '@/lib/questions/es'
import { categories as enCategories } from '@/lib/questions/en'
import { calculateDeterministicScores } from '@/lib/questions/scoring'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuestionRenderer } from '@/components/assessment/QuestionRenderer'

export default function QuestionsPage() {
  const { lang } = useParams<{ lang: string }>()
  const router = useRouter()
  const { state, dispatch } = useAssessment()
  const dict = getDictionary(lang as Lang)
  const categories = lang === 'es' ? esCategories : enCategories
  const category = categories[state.currentCategory]
  const totalCategories = categories.length

  // Redirect to context if no business context
  if (!state.businessContext) {
    router.push(`/${lang}/evaluacion`)
    return null
  }

  // Count answered questions in current category
  const answeredInCategory = category.questions.filter(
    q => {
      const r = state.responses[q.id]
      if (Array.isArray(r)) return r.length > 0
      return r && r.length > 0
    }
  ).length

  // Only require scored questions
  const requiredInCategory = category.questions.filter(q => q.isScored).length
  const answeredRequired = category.questions.filter(
    q => q.isScored && state.responses[q.id] && (Array.isArray(state.responses[q.id]) ? (state.responses[q.id] as string[]).length > 0 : true)
  ).length
  const canProceed = answeredRequired >= requiredInCategory

  const isLastCategory = state.currentCategory === totalCategories - 1

  // Total progress
  const totalQuestions = categories.reduce((acc, c) => acc + c.questions.length, 0)
  const totalAnswered = categories.reduce((acc, c) =>
    acc + c.questions.filter(q => {
      const r = state.responses[q.id]
      if (Array.isArray(r)) return r.length > 0
      return r && r.length > 0
    }).length
  , 0)

  async function handleNext() {
    if (isLastCategory) {
      // Calculate scores and submit
      const scores = calculateDeterministicScores(categories, state.responses)
      dispatch({ type: 'SET_STEP', payload: 'loading' })
      dispatch({ type: 'SET_ERROR', payload: null })
      router.push(`/${lang}/evaluacion/resultado`)

      try {
        const res = await fetch('/api/generate-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessContext: state.businessContext,
            responses: state.responses,
            deterministicScores: scores,
            language: lang,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const msg = data.error || (lang === 'es' ? 'Error al generar el reporte.' : 'Error generating report.')
          dispatch({ type: 'SET_ERROR', payload: msg })
          return
        }
        const report = await res.json()
        dispatch({ type: 'SET_REPORT', payload: report })
      } catch {
        dispatch({
          type: 'SET_ERROR',
          payload: lang === 'es'
            ? 'Error de conexión. Verifica tu internet e intenta de nuevo.'
            : 'Connection error. Check your internet and try again.',
        })
      }
    } else {
      dispatch({ type: 'NEXT_CATEGORY' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Progress */}
      <div className="mb-8">
        <ProgressBar current={totalAnswered} total={totalQuestions} />
      </div>

      {/* Category header */}
      <div className="mb-8">
        <div className="text-sm text-fucsia font-medium mb-2">
          {t(dict, 'assessment.categoryOf', { current: state.currentCategory + 1, total: totalCategories })}
        </div>
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span>{category.icon}</span>
          {category.name}
        </h2>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {category.questions.map((question, idx) => (
          <div key={question.id} className={`animate-fade-up animate-fade-up-delay-${idx + 1}`}>
            <QuestionRenderer
              question={question}
              value={state.responses[question.id]}
              onChange={(value) => dispatch({ type: 'SET_RESPONSE', payload: { questionId: question.id, value } })}
              questionNumber={idx + 1}
              lang={lang as Lang}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10 gap-4">
        <Button
          variant="secondary"
          onClick={() => {
            if (state.currentCategory === 0) {
              router.push(`/${lang}/evaluacion`)
            } else {
              dispatch({ type: 'PREV_CATEGORY' })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          {t(dict, 'assessment.back')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
        >
          {isLastCategory ? t(dict, 'assessment.submit') : t(dict, 'assessment.next')}
        </Button>
      </div>
    </div>
  )
}
