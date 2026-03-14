'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAssessment } from '@/lib/context/AssessmentContext'
import { getDictionary, t } from '@/lib/i18n'
import { Lang, BusinessContext } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'

export default function BusinessContextPage() {
  const { lang } = useParams<{ lang: string }>()
  const router = useRouter()
  const { dispatch } = useAssessment()
  const dict = getDictionary(lang as Lang)

  const [form, setForm] = useState<Partial<BusinessContext>>({
    companyName: '',
    contactName: '',
    industry: '',
    revenueRange: '',
    teamSize: '',
    country: '',
    painPoint: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const required = ['companyName', 'contactName', 'industry', 'revenueRange', 'teamSize', 'country'] as const

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    for (const field of required) {
      if (!form[field]) {
        newErrors[field] = lang === 'es' ? 'Este campo es requerido' : 'This field is required'
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    dispatch({ type: 'SET_BUSINESS_CONTEXT', payload: form as BusinessContext })
    router.push(`/${lang}/evaluacion/preguntas`)
  }

  function update(field: keyof BusinessContext, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const industries = Object.entries(
    dict.context.industries as Record<string, string>
  ).map(([value, label]) => ({ value, label }))

  const revenues = Object.entries(
    dict.context.revenues as Record<string, string>
  ).map(([value, label]) => ({ value, label }))

  const teamSizes = Object.entries(
    dict.context.teamSizes as Record<string, string>
  ).map(([value, label]) => ({ value, label }))

  const countries = Object.entries(
    dict.context.countries as Record<string, string>
  ).map(([value, label]) => ({ value, label }))

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">{t(dict, 'context.title')}</h1>
        <p className="text-text-secondary">{t(dict, 'context.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <Input
            id="companyName"
            label={t(dict, 'context.companyName')}
            value={form.companyName}
            onChange={e => update('companyName', e.target.value)}
            error={errors.companyName}
          />
          <Input
            id="contactName"
            label={t(dict, 'context.contactName')}
            value={form.contactName}
            onChange={e => update('contactName', e.target.value)}
            error={errors.contactName}
          />
        </div>

        <Select
          id="industry"
          label={t(dict, 'context.industry')}
          options={industries}
          placeholder={lang === 'es' ? 'Selecciona tu industria' : 'Select your industry'}
          value={form.industry}
          onChange={e => update('industry', e.target.value)}
        />
        {errors.industry && <p className="text-sm text-red-400 -mt-4">{errors.industry}</p>}

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Select
              id="revenueRange"
              label={t(dict, 'context.revenueRange')}
              options={revenues}
              placeholder={lang === 'es' ? 'Selecciona rango' : 'Select range'}
              value={form.revenueRange}
              onChange={e => update('revenueRange', e.target.value)}
            />
            {errors.revenueRange && <p className="text-sm text-red-400 mt-1">{errors.revenueRange}</p>}
          </div>
          <div>
            <Select
              id="teamSize"
              label={t(dict, 'context.teamSize')}
              options={teamSizes}
              placeholder={lang === 'es' ? 'Selecciona tamaño' : 'Select size'}
              value={form.teamSize}
              onChange={e => update('teamSize', e.target.value)}
            />
            {errors.teamSize && <p className="text-sm text-red-400 mt-1">{errors.teamSize}</p>}
          </div>
        </div>

        <Select
          id="country"
          label={t(dict, 'context.country')}
          options={countries}
          placeholder={lang === 'es' ? 'Selecciona país' : 'Select country'}
          value={form.country}
          onChange={e => update('country', e.target.value)}
        />
        {errors.country && <p className="text-sm text-red-400 -mt-4">{errors.country}</p>}

        <Textarea
          id="painPoint"
          label={`${t(dict, 'context.painPoint')} ${t(dict, 'assessment.optional')}`}
          placeholder={t(dict, 'context.painPointPlaceholder')}
          value={form.painPoint}
          onChange={e => update('painPoint', e.target.value)}
        />

        <Button type="submit" size="lg" className="w-full">
          {t(dict, 'context.continue')}
        </Button>
      </form>
    </div>
  )
}
