/**
 * Генерирует ссылки на карты по координатам.
 * Используем координаты вместо строки адреса, чтобы геокодер не
 * подставлял не ту улицу / не то здание.
 */

export interface MapLinks {
  yandex: string
  google: string
  apple: string
}

export function getMapLinks(lat: number, lng: number, query?: string): MapLinks {
  const q = encodeURIComponent(query || `${lat},${lng}`)
  const ll = `${lng.toFixed(6)},${lat.toFixed(6)}`

  return {
    yandex: `https://yandex.ru/maps/?pt=${ll}&z=16&l=map&text=${q}`,
    google: `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}&query_place_id=${q}`,
    apple: `https://maps.apple.com/?ll=${lat.toFixed(6)},${lng.toFixed(6)}&q=${q}`,
  }
}

export function getMapLink(lat: number, lng: number, query?: string, provider: 'yandex' | 'google' | 'apple' = 'yandex'): string {
  return getMapLinks(lat, lng, query)[provider]
}
