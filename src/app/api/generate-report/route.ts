import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts/report-prompt'
import { calculateDeterministicScores, getMaturityLevel, normalizeCategoryScore } from '@/lib/questions/scoring'
import { categories as esCategories } from '@/lib/questions/es'
import { categories as enCategories } from '@/lib/questions/en'
import { Lang, AIReportData, Report } from '@/lib/types'
import { validateAIReportData } from '@/lib/validation/report-validation'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { businessContext, responses, language } = body
    const lang = (language || 'es') as Lang

    if (!businessContext || !responses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const categories = lang === 'es' ? esCategories : enCategories

    // Calculate deterministic scores server-side
    const scores = calculateDeterministicScores(categories, responses)

    // Build prompt
    const systemPrompt = buildSystemPrompt(lang)
    const userPrompt = buildUserPrompt(businessContext, responses, scores, lang)

    // Call Anthropic API with 60s timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000)

    let message: Anthropic.Message
    try {
      message = await client.messages.create(
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        },
        { signal: controller.signal }
      )
    } catch (err: unknown) {
      clearTimeout(timeout)
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Report generation timed out. Please try again.' },
          { status: 504 }
        )
      }
      throw err
    }
    clearTimeout(timeout)

    // Extract text from response
    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No text in API response. Please try again.' },
        { status: 502 }
      )
    }

    // Parse JSON — handle potential markdown code fences
    let jsonStr = textBlock.text.trim()
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let aiData: AIReportData
    try {
      const parsed = JSON.parse(jsonStr)
      if (!validateAIReportData(parsed)) {
        console.error('AI response validation failed:', JSON.stringify(parsed).slice(0, 500))
        return NextResponse.json(
          { error: 'AI generated an incomplete report. Please try again.' },
          { status: 502 }
        )
      }
      aiData = parsed
    } catch (parseErr) {
      console.error('JSON parse failed:', parseErr, 'Raw:', jsonStr.slice(0, 500))
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 502 }
      )
    }

    // Compute final scores
    const totalScore = Math.min(100, scores.total + aiData.aiAdjustmentScore)
    const maturity = getMaturityLevel(totalScore)

    const categoryKeys = ['marketing', 'sales', 'operations', 'customerExperience', 'dataAnalytics'] as const
    const categoryScores: Report['categoryScores'] = {}

    for (const key of categoryKeys) {
      const raw = scores[key] + (aiData.categoryAdjustments[key] ?? 0)
      const normalized = normalizeCategoryScore(raw, 20) // max 15 scored + 5 AI = 20
      const catMaturity = getMaturityLevel(normalized)
      const maturityLabels: Record<string, Record<string, string>> = {
        es: { '1': 'Manual Total', '2': 'Iniciando', '3': 'En Desarrollo', '4': 'Avanzado', '5': 'AI-First' },
        en: { '1': 'Fully Manual', '2': 'Getting Started', '3': 'Developing', '4': 'Advanced', '5': 'AI-First' },
      }
      categoryScores[key] = {
        raw,
        normalized: Math.min(100, normalized),
        label: maturityLabels[lang][catMaturity.key],
      }
    }

    const maturityLabels: Record<string, Record<string, string>> = {
      es: { '1': 'Manual Total', '2': 'Iniciando', '3': 'En Desarrollo', '4': 'Avanzado', '5': 'AI-First' },
      en: { '1': 'Fully Manual', '2': 'Getting Started', '3': 'Developing', '4': 'Advanced', '5': 'AI-First' },
    }

    const report: Report = {
      overallScore: totalScore,
      maturityLevel: maturity.level,
      maturityLabel: maturityLabels[lang][maturity.key],
      categoryScores,
      ai: aiData,
      businessContext,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Report generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    )
  }
}
