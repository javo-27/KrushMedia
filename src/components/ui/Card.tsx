export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-dark-800 border border-dark-600 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}
