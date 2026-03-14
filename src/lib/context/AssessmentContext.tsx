'use client'

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { AssessmentState, AssessmentAction, Lang } from '@/lib/types'

const initialState: AssessmentState = {
  currentStep: 'context',
  businessContext: null,
  currentCategory: 0,
  responses: {},
  report: null,
  isGateUnlocked: false,
  language: 'es',
}

function reducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'SET_BUSINESS_CONTEXT':
      return { ...state, businessContext: action.payload, currentStep: 'questions' }
    case 'SET_RESPONSE':
      return {
        ...state,
        responses: { ...state.responses, [action.payload.questionId]: action.payload.value },
      }
    case 'NEXT_CATEGORY':
      return { ...state, currentCategory: Math.min(state.currentCategory + 1, 4) }
    case 'PREV_CATEGORY':
      return { ...state, currentCategory: Math.max(state.currentCategory - 1, 0) }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'SET_REPORT':
      return { ...state, report: action.payload, currentStep: 'results' }
    case 'UNLOCK_GATE':
      return { ...state, isGateUnlocked: true }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    default:
      return state
  }
}

const STORAGE_KEY = 'ai-readiness-assessment'

function loadState(lang: Lang): AssessmentState {
  if (typeof window === 'undefined') return { ...initialState, language: lang }
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...parsed, language: lang }
    }
  } catch {}
  return { ...initialState, language: lang }
}

const AssessmentContext = createContext<{
  state: AssessmentState
  dispatch: React.Dispatch<AssessmentAction>
} | null>(null)

export function AssessmentProvider({ children, lang }: { children: ReactNode; lang: Lang }) {
  const [state, dispatch] = useReducer(reducer, lang, loadState)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext)
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider')
  return ctx
}
