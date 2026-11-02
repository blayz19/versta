import type { Achievement } from '../types'

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked?: boolean
  unlockedAt?: string
}

export default function AchievementBadge({
  achievement,
  unlocked = false,
  unlockedAt,
}: AchievementBadgeProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-colors ${
      unlocked
        ? 'border-brand bg-brand/10'
        : 'border-white/5 bg-white/[0.02] text-mist-muted'
    }`}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl">
        {achievement.icon}
      </div>
      <h4 className={`text-sm font-bold ${unlocked ? 'text-mist' : 'text-mist-muted/50'}`}>
        {achievement.title}
      </h4>
      <p className="text-xs text-mist-muted/60 text-center leading-tight">
        {achievement.description}
      </p>
      {unlocked && (
        <span className="text-xs text-brand font-medium">
          Получено{unlockedAt ? ` • ${new Date(unlockedAt).toLocaleDateString('ru-RU')}` : ''}
        </span>
      )}
    </div>
  )
}
