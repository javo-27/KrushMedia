'use client'

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-text-muted mb-2">
        <span>{current}/{total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-fucsia to-fucsia-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
