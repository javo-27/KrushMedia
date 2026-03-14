const colorMap = {
  fucsia: 'bg-fucsia/10 text-fucsia border-fucsia/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  gray: 'bg-dark-500/50 text-text-secondary border-dark-400',
}

export function Badge({
  children,
  color = 'fucsia',
  className = '',
}: {
  children: React.ReactNode
  color?: keyof typeof colorMap
  className?: string
}) {
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${colorMap[color]} ${className}`}>
      {children}
    </span>
  )
}
