import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const leadSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional().default(''),
  contactMe: z.boolean().optional().default(false),
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  industry: z.string().min(1),
  revenueRange: z.string().min(1),
  overallScore: z.number().min(0).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid lead data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, phone, contactMe, companyName, contactName, industry, revenueRange, overallScore } = parsed.data

    // Send notification email via Resend (if configured) or log
    const resendKey = process.env.RESEND_API_KEY
    const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL

    if (resendKey && notifyEmail) {
      const emailBody = `
New AI Readiness Assessment Lead

Name: ${contactName}
Company: ${companyName}
Industry: ${industry}
Revenue Range: ${revenueRange}
Overall Score: ${overallScore}/100
Email: ${email}
Phone: ${phone || 'Not provided'}
Wants to be contacted: ${contactMe ? 'Yes' : 'No'}

Timestamp: ${new Date().toISOString()}
      `.trim()

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AI Readiness Score <notifications@krushmedia.mx>',
          to: notifyEmail,
          subject: `[Lead] ${companyName} - Score ${overallScore}/100 - ${contactMe ? 'WANTS CONTACT' : 'Report only'}`,
          text: emailBody,
        }),
      })

      if (!emailRes.ok) {
        console.error('Resend API error:', await emailRes.text().catch(() => 'unknown'))
        return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 })
      }
    } else {
      // Fallback: log to console for development
      console.log('=== NEW LEAD ===')
      console.log({ email, phone, contactMe, companyName, contactName, industry, revenueRange, overallScore })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead capture failed:', error)
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 })
  }
}
