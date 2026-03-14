import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, phone, contactMe, companyName, contactName, industry, revenueRange, overallScore } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

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

      await fetch('https://api.resend.com/emails', {
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
