export type Lang = 'es' | 'en'

export interface BusinessContext {
  companyName: string
  contactName: string
  industry: string
  revenueRange: string
  teamSize: string
  country: string
  painPoint: string
}

export type QuestionType = 'select' | 'multi-select' | 'scale' | 'textarea'

export interface QuestionOption {
  value: string
  label: string
  score?: number
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: QuestionOption[]
  placeholder?: string
  isScored: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  questions: Question[]
}

export interface CategoryScores {
  marketing: number
  sales: number
  operations: number
  customerExperience: number
  dataAnalytics: number
  total: number
}

export interface Gap {
  category: string
  gap: string
  impact: 'high' | 'medium' | 'low'
  explanation: string
}

export interface UseCase {
  title: string
  category: string
  description: string
  weeklyHoursSaved: number
  monthlyROI: string
  complexity: 'quick-win' | 'medium' | 'advanced'
}

export interface ActionItem {
  priority: number
  action: string
  timeframe: string
  expectedImpact: string
}

export interface IndustryBenchmark {
  averageScore: number
  percentileRank: string
  insight: string
}

export interface AIReportData {
  aiAdjustmentScore: number
  categoryAdjustments: Record<string, number>
  executiveSummary: string
  topGaps: Gap[]
  useCases: UseCase[]
  actionItems: ActionItem[]
  industryBenchmark: IndustryBenchmark
}

export interface Report {
  overallScore: number
  maturityLevel: number
  maturityLabel: string
  categoryScores: Record<string, { raw: number; normalized: number; label: string }>
  ai: AIReportData
  businessContext: BusinessContext
  generatedAt: string
}

export interface AssessmentState {
  currentStep: 'context' | 'questions' | 'loading' | 'results'
  businessContext: BusinessContext | null
  currentCategory: number
  responses: Record<string, string | string[]>
  report: Report | null
  isGateUnlocked: boolean
  language: Lang
}

export type AssessmentAction =
  | { type: 'SET_BUSINESS_CONTEXT'; payload: BusinessContext }
  | { type: 'SET_RESPONSE'; payload: { questionId: string; value: string | string[] } }
  | { type: 'NEXT_CATEGORY' }
  | { type: 'PREV_CATEGORY' }
  | { type: 'SET_STEP'; payload: AssessmentState['currentStep'] }
  | { type: 'SET_REPORT'; payload: Report }
  | { type: 'UNLOCK_GATE' }
  | { type: 'SET_LANGUAGE'; payload: Lang }
