import { BusinessContext, CategoryScores, Lang } from '@/lib/types'

export function buildSystemPrompt(lang: Lang): string {
  const langInstructions = lang === 'es'
    ? 'Responde en español. Usa tono directo, experto y práctico - sin fluff.'
    : 'Respond in English. Use a direct, expert, and practical tone - no fluff.'

  return `You are an AI readiness analyst for Krush Media, an AI-first digital growth agency based in Mexico. You evaluate businesses on their AI adoption maturity and provide actionable, specific recommendations.

${langInstructions}

Your recommendations should be specific to the business's industry, size, and current maturity level. Avoid generic advice - every recommendation should feel tailored.

When estimating ROI and hours saved, be realistic and conservative. Base estimates on the company's revenue range and team size.

Return ONLY valid JSON matching the schema provided. No markdown, no code fences, no explanation outside the JSON.`
}

export function buildUserPrompt(
  businessContext: BusinessContext,
  responses: Record<string, string | string[]>,
  scores: CategoryScores,
  lang: Lang
): string {
  const responsesFormatted = Object.entries(responses)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('\n')

  return `Analyze this business's AI readiness and generate a personalized report.

## Business Context
- Company: ${businessContext.companyName}
- Contact: ${businessContext.contactName}
- Industry: ${businessContext.industry}
- Monthly Revenue: ${businessContext.revenueRange}
- Team Size: ${businessContext.teamSize}
- Country: ${businessContext.country}
- Primary Pain Point: ${businessContext.painPoint || 'Not specified'}

## Assessment Responses
${responsesFormatted}

## Deterministic Scores (each category max 15, total max 75)
- Marketing: ${scores.marketing}/15
- Sales: ${scores.sales}/15
- Operations: ${scores.operations}/15
- Customer Experience: ${scores.customerExperience}/15
- Data & Analytics: ${scores.dataAnalytics}/15
- Total: ${scores.total}/75

## Instructions
1. Assign an AI adjustment score (0-25) based on qualitative analysis of free-form responses and overall business maturity signals.
2. For each category, assign a qualitative adjustment (0-5) based on the free-form response quality.
3. Identify the top 3 gaps ranked by potential business impact.
4. Recommend 5 specific AI use cases tailored to their industry (${businessContext.industry}) and responses. Each use case must be implementable within 90 days.
5. Estimate weekly hours saved and monthly ROI range for each use case based on their revenue (${businessContext.revenueRange}) and team size (${businessContext.teamSize}).
6. Provide 5 prioritized action items (quick wins first, then progressive complexity).
7. Write a 2-paragraph executive summary addressing ${businessContext.contactName} directly.
8. Provide an industry benchmark insight.

Return JSON matching this exact schema:
{
  "aiAdjustmentScore": number (0-25),
  "categoryAdjustments": {
    "marketing": number (0-5),
    "sales": number (0-5),
    "operations": number (0-5),
    "customerExperience": number (0-5),
    "dataAnalytics": number (0-5)
  },
  "executiveSummary": "string (2 paragraphs, addresses ${businessContext.contactName} directly)",
  "topGaps": [
    {
      "category": "string",
      "gap": "string (specific gap description)",
      "impact": "high" | "medium" | "low",
      "explanation": "string (why this matters and what it costs them)"
    }
  ],
  "useCases": [
    {
      "title": "string",
      "category": "string",
      "description": "string (2-3 sentences, specific to their business)",
      "weeklyHoursSaved": number,
      "monthlyROI": "string (e.g. '$2,000 - $5,000')",
      "complexity": "quick-win" | "medium" | "advanced"
    }
  ],
  "actionItems": [
    {
      "priority": number (1-5),
      "action": "string (specific, actionable)",
      "timeframe": "string (e.g. 'This week', '30 days', '90 days')",
      "expectedImpact": "string"
    }
  ],
  "industryBenchmark": {
    "averageScore": number (industry average 0-100),
    "percentileRank": "string (e.g. 'Top 30% in ${businessContext.industry}')",
    "insight": "string (1-2 sentences comparing them to industry)"
  }
}`
}
