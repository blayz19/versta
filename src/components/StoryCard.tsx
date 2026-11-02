import { Link } from 'react-router-dom'
import type { Story } from '../types'

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      to={story.action_url || '/'}
      className="flex-shrink-0 w-64 rounded-3xl border border-glass bg-surface overflow-hidden transition-all duration-300 hover:border-brand/40"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={story.image_url}
          alt={story.business_name}
          className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.src = 'https://images.unsplash.com/photo-1492392760666-7f6072e9f855?w=800&q=80'
            img.alt = story.business_name
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/30 px-2.5 py-1 text-xs font-semibold text-brand backdrop-blur-sm">
            История
          </span>
          <h3 className="mt-2 text-sm font-bold text-mist line-clamp-1">{story.business_name}</h3>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs text-mist-soft/70 line-clamp-2">{story.caption}</p>
      </div>
    </Link>
  )
}
