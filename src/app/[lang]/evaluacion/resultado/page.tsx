'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAssessment } from '@/lib/context/AssessmentContext'
import { getDictionary, t } from '@/lib/i18n'
import { Lang } from '@/lib/types'
import { LoadingState } from '@/components/results/LoadingState'
import { ScoreHero } from '@/components/results/ScoreHero'
import { CategoryBreakdown } from '@/components/results/CategoryBreakdown'
import { ExecutiveSummary } from '@/components/results/ExecutiveSummary'
import { GapsSection } from '@/components/results/GapsSection'
import { UseCasesSection } from '@/components/results/UseCasesSection'
import { ActionPlanSection } from '@/components/results/ActionPlanSection'
import { EmailGateModal } from '@/components/results/EmailGateModal'
import { CTABlock } from '@/components/results/CTABlock'

export default function ResultadoPage() {
  const { lang } = useParams<{ lang: string }>()
  const router = useRouter()
  const { state, dispatch } = useAssessment()
  const dict = getDictionary(lang as Lang)

  // If no business context, redirect
  if (!state.businessContext) {
    router.push(`/${lang}/evaluacion`)
    return null
  }

  // Loading state
  if (!state.report) {
    return <LoadingState lang={lang as Lang} />
  }

  const { report, isGateUnlocked } = state

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Score Hero */}
      <ScoreHero
        score={report.overallScore}
        maturityLabel={report.maturityLabel}
        companyName={report.businessContext.companyName}
        benchmark={report.ai.industryBenchmark}
        lang={lang as Lang}
      />

      {/* Executive Summary */}
      <ExecutiveSummary text={report.ai.executiveSummary} lang={lang as Lang} />

      {/* Category Breakdown */}
      <CategoryBreakdown scores={report.categoryScores} lang={lang as Lang} />

      {/* Email gate modal */}
      {!isGateUnlocked && (
        <EmailGateModal
          report={report}
          lang={lang as Lang}
          onUnlock={() => dispatch({ type: 'UNLOCK_GATE' })}
        />
      )}

      {/* Gated content */}
      {isGateUnlocked && (
        <>
          <GapsSection gaps={report.ai.topGaps} lang={lang as Lang} />
          <UseCasesSection useCases={report.ai.useCases} lang={lang as Lang} />
          <ActionPlanSection actionItems={report.ai.actionItems} lang={lang as Lang} />
        </>
      )}

      {/* CTA */}
      <CTABlock lang={lang as Lang} />
    </div>
  )
}
