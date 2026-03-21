import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL
  const bookingUrl = process.env.NEXT_PUBLIC_CALENDLY_URL

  return NextResponse.json({
    anthropicKey: apiKey ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}` : 'NOT SET',
    resendKey: resendKey ? 'SET' : 'NOT SET',
    notifyEmail: notifyEmail || 'NOT SET',
    bookingUrl: bookingUrl || 'NOT SET',
  })
}
