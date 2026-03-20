'use client'

import { useState } from 'react'
import { Lang, Report } from '@/lib/types'
import { getDictionary, t } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface EmailGateModalProps {
  report: Report
  lang: Lang
  onUnlock: () => void
}

export function EmailGateModal({ report, lang, onUnlock }: EmailGateModalProps) {
  const dict = getDictionary(lang)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactMe, setContactMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError(lang === 'es' ? 'Ingresa un email válido' : 'Enter a valid email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          contactMe,
          companyName: report.businessContext.companyName,
          contactName: report.businessContext.contactName,
          industry: report.businessContext.industry,
          revenueRange: report.businessContext.revenueRange,
          overallScore: report.overallScore,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        onUnlock()
      } else {
        setError(lang === 'es' ? 'Error al guardar. Intenta de nuevo.' : 'Error saving. Please try again.')
      }
    } catch {
      setError(lang === 'es' ? 'Error al enviar. Intenta de nuevo.' : 'Error sending. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-dark-800 to-dark-900 border border-fucsia/20 rounded-2xl p-8 text-center animate-fade-up">
      <div className="text-3xl mb-4">🔓</div>
      <h3 className="text-xl font-bold mb-2">{t(dict, 'gate.title')}</h3>
      <p className="text-text-secondary mb-6 text-sm">{t(dict, 'gate.subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto text-left">
        <Input
          id="gate-email"
          label={t(dict, 'gate.email')}
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          error={error}
        />
        <Input
          id="gate-phone"
          label={t(dict, 'gate.phone')}
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={contactMe}
            onChange={e => setContactMe(e.target.checked)}
            className="w-4 h-4 rounded border-dark-500 bg-dark-700 text-fucsia focus:ring-fucsia"
          />
          <span className="text-sm text-text-secondary">{t(dict, 'gate.contactMe')}</span>
        </label>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '...' : t(dict, 'gate.unlock')}
        </Button>

        <p className="text-xs text-text-muted text-center">{t(dict, 'gate.privacy')}</p>
      </form>
    </div>
  )
}
