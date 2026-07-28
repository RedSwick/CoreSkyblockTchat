import type { RankResult } from '../lib/ranks'

export function RankBadge({ rank, size = 'md' }: { rank: RankResult | null; size?: 'sm' | 'md' | 'lg' }) {
  if (!rank) return null

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium shrink-0 ${sizes[size]}`}
      style={{ backgroundColor: `${rank.color}22`, color: rank.color, border: `1px solid ${rank.color}55` }}
    >
      <span>{rank.icon}</span>
      {rank.tierName}
    </span>
  )
}
