import { useState } from 'react'
import Button from '../components/Button'

const features = [
  { title: 'Профиль', desc: 'Информация о бизнесе, фото, описание и контакты.' },
  { title: 'Discovery', desc: 'Попадание в подходящие пользовательские сценарии.' },
  { title: 'Аналитика', desc: 'Просмотры → переходы → действия.' },
  { title: 'Спецпредложения', desc: 'Промокоды и предложения для пользователей.' },
]

export default function Business() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-mist sm:text-4xl">
        Привлекайте клиентов не рекламой, а релевантными сценариями
      </h1>
      <p className="mt-3 text-lg text-mist/50">
        Покажите свой бизнес людям в момент, когда он им действительно подходит.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="font-semibold text-mist">{f.title}</h3>
            <p className="mt-2 text-sm text-mist/50">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        {submitted ? (
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-8 text-center">
            <p className="text-lg font-medium text-brand">Спасибо! Мы свяжемся с вами.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-mist">Оставить заявку</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-mist placeholder:text-mist/30 outline-none focus:border-brand/50"
              />
              <input
                type="text"
                placeholder="Компания"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-mist placeholder:text-mist/30 outline-none focus:border-brand/50"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-mist placeholder:text-mist/30 outline-none focus:border-brand/50"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-mist placeholder:text-mist/30 outline-none focus:border-brand/50"
              />
            </div>
            <textarea
              placeholder="Что хотите продвигать?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-mist placeholder:text-mist/30 outline-none focus:border-brand/50"
            />
            <Button size="lg" className="mt-6">Оставить заявку</Button>
          </form>
        )}
      </div>
    </div>
  )
}
