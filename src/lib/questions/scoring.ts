import { Category, CategoryScores } from '@/lib/types'

export function calculateDeterministicScores(
  categories: Category[],
  responses: Record<string, string | string[]>
): CategoryScores {
  const scores: Record<string, number> = {}

  for (const category of categories) {
    let categoryScore = 0
    for (const question of category.questions) {
      if (!question.isScored || !question.options) continue
      const response = responses[question.id]
      if (!response) continue

      if (question.type === 'multi-select' && Array.isArray(response)) {
        // For multi-select, take the highest score among selected options
        const maxScore = response.reduce((max, val) => {
          const option = question.options!.find(o => o.value === val)
          return Math.max(max, option?.score ?? 0)
        }, 0)
        categoryScore += maxScore
      } else {
        const option = question.options.find(o => o.value === response)
        categoryScore += option?.score ?? 0
      }
    }
    scores[category.id] = categoryScore
  }

  const total = Object.values(scores).reduce((sum, s) => sum + s, 0)

  return {
    marketing: scores.marketing ?? 0,
    sales: scores.sales ?? 0,
    operations: scores.operations ?? 0,
    customerExperience: scores.customerExperience ?? 0,
    dataAnalytics: scores.dataAnalytics ?? 0,
    total,
  }
}

export function getMaturityLevel(score: number): { level: number; key: string } {
  if (score <= 20) return { level: 1, key: '1' }
  if (score <= 40) return { level: 2, key: '2' }
  if (score <= 60) return { level: 3, key: '3' }
  if (score <= 80) return { level: 4, key: '4' }
  return { level: 5, key: '5' }
}

export function normalizeCategoryScore(raw: number, maxRaw: number = 15): number {
  return Math.round((raw / maxRaw) * 100)
}
