'use client'

import { type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export function Textarea({ label, hint, className = '', id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        className={`w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-fucsia focus:ring-1 focus:ring-fucsia transition-colors resize-none ${className}`}
        {...props}
      />
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}
