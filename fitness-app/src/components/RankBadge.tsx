import type { RankResult } from '../lib/ranks'

export function RankBadge({ rank, size = 'md' }: { rank: RankResult | null; size?: 'sm' | 'md' | 'lg' }) {
  if (!rank) return null

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  }
  const isTopTier = rank.tierIndex >= 6

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold shrink-0 ${sizes[size]}`}
      style={{
        background: `linear-gradient(135deg, ${rank.color}2e, ${rank.color}12)`,
        color: rank.color,
        border: `1px solid ${rank.color}66`,
        boxShadow: isTopTier ? `0 0 12px ${rank.color}40` : undefined,
      }}
    >
      <span>{rank.icon}</span>
      {rank.label}
    </span>
  )
}
