import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaceMap from '../components/PlaceMap'
import { useSocialMarkers } from '../hooks/useSocialMarkers'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import { Link } from 'react-router-dom'

const MARKER_TYPES = [
  { value: 'ищу компанию', label: 'Ищу компанию' },
  { value: 'могу показать город', label: 'Могу показать город' },
  { value: 'хочу рассказать о новом месте', label: 'Новое место' },
]

const EXPIRY_OPTIONS = [
  { value: 3, label: '3 часа' },
  { value: 6, label: '6 часов' },
  { value: 12, label: '12 часов' },
]

export default function MarkersPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { markers, loading, createMarker, deleteMarker, isOwner } = useSocialMarkers()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    marker_type: 'ищу компанию',
    text: '',
    latitude: 56.4901,
    longitude: 84.9487,
    expiresHours: 6,
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!user) {
      navigate('/auth')
      return
    }
    try {
      const expiresAt = new Date(Date.now() + form.expiresHours * 60 * 60 * 1000).toISOString()
      await createMarker({
        marker_type: form.marker_type,
        text: form.text,
        latitude: form.latitude,
        longitude: form.longitude,
        expiresAt,
      })
      setForm({ marker_type: 'ищу компанию', text: '', latitude: 56.4901, longitude: 84.9487, expiresHours: 6 })
      setOpen(false)
    } catch (err: any) {
      setError(err.message || 'Не удалось создать метку')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="h-16 w-16 rounded-full border border-glass bg-surface flex items-center justify-center text-mist-muted mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-mist mb-2">Загрузка меток…</h2>
      </div>
    )
  }

  const activeMarkers = markers.filter(
    (m) => m.is_active && new Date(m.expires_at) > new Date()
  )

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 h-[calc(100vh-112px)] flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-6 z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-5xl mb-2">Социальные метки</h1>
          <p className="text-lg text-mist-soft/70">
            Короткие сигналы о намерениях других людей. Метки автоматически скрываются по истечении срока.
          </p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setOpen(true)}>Оставить метку</Button>
        )}
        <Link to="/" className="inline-flex items-center gap-2 text-brand hover:underline text-sm">
          На главную
        </Link>
      </div>

      <div className="relative flex-1 min-h-0 z-0">
        <PlaceMap
          places={[]}
          socialMarkers={activeMarkers}
          height="100%"
          onMarkerClick={(m) => navigate(`/place/${m.place_id || 1}`)}
        />
      </div>

      {/* List panel below map on mobile, hidden on desktop */}
      <div className="lg:hidden mt-6 space-y-3">
        <h3 className="text-sm font-bold text-mist mb-3">Активные метки</h3>
        {activeMarkers.length === 0 ? (
          <p className="text-sm text-mist-muted/50">Пока нет активных меток поблизости.</p>
        ) : (
          activeMarkers.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-glass bg-surface p-4 transition-all hover:bg-surface-hover cursor-pointer group"
              onClick={() => navigate(`/place/${m.place_id || 1}`)}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-brand">{m.marker_type}</span>
                {isOwner(m) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMarker(m.id)
                    }}
                    className="text-mist-muted/40 hover:text-brand transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="text-sm text-mist-soft/70 line-clamp-2">{m.text}</p>
              <p className="mt-1 text-xs text-mist-muted/50">
                истекает {new Date(m.expires_at).toLocaleString('ru-RU', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Create marker modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-glass bg-surface p-6 sm:p-8 w-full max-w-md mx-4 shadow-2xl shadow-black/50">
            <h3 className="text-lg font-bold text-mist mb-6">Новая метка</h3>
            {error && (
              <div className="mb-4 p-3 rounded-xl border border-brand/20 bg-brand/5 text-sm text-brand">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-mist-muted/70 mb-2">Тип намерения</label>
                <div className="flex gap-2">
                  {MARKER_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, marker_type: t.value }))}
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                        form.marker_type === t.value
                          ? 'border-brand bg-brand text-ink'
                          : 'border-glass bg-surface text-mist-soft hover:border-brand/40 hover:text-mist'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-mist-muted/70 mb-2">Текст (до 160 символов)</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  rows={3}
                  className="w-full rounded-xl border border-glass bg-surface px-4 py-3 text-mist placeholder:text-mist-muted/50 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  placeholder="Расскажи, что ищешь или предлагаешь…"
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-mist-muted/50">{form.text.length}/160 символов</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-mist-muted/70 mb-2">Срок действия</label>
                <div className="flex gap-2">
                  {EXPIRY_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, expiresHours: o.value }))}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                        form.expiresHours === o.value
                          ? 'border-brand bg-brand text-ink'
                          : 'border-glass bg-surface text-mist-soft hover:border-brand/40 hover:text-mist'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-medium text-mist-soft hover:bg-surface-hover transition-colors"
                >
                  Отмена
                </button>
                <Button type="submit" size="lg" className="flex-1">
                  Опубликовать
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
