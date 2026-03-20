import { AIReportData } from '@/lib/types'

export function validateAIReportData(data: unknown): data is AIReportData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>

  if (typeof d.aiAdjustmentScore !== 'number') return false
  if (typeof d.executiveSummary !== 'string' || !d.executiveSummary) return false

  if (!d.categoryAdjustments || typeof d.categoryAdjustments !== 'object') return false

  if (!Array.isArray(d.topGaps) || d.topGaps.length === 0) return false
  for (const g of d.topGaps) {
    if (!g.gap || !g.impact || !g.explanation) return false
  }

  if (!Array.isArray(d.useCases) || d.useCases.length === 0) return false
  for (const u of d.useCases) {
    if (!u.title || !u.description || !u.complexity) return false
  }

  if (!Array.isArray(d.actionItems) || d.actionItems.length === 0) return false
  for (const a of d.actionItems) {
    if (!a.action || !a.timeframe || !a.expectedImpact) return false
  }

  if (!d.industryBenchmark || typeof d.industryBenchmark !== 'object') return false
  const b = d.industryBenchmark as Record<string, unknown>
  if (typeof b.averageScore !== 'number' || !b.percentileRank || !b.insight) return false

  return true
}
