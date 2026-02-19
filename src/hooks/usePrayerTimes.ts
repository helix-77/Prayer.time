import { useState, useEffect } from 'react'
import { Coordinates, PrayerTimes, CalculationMethod, CalculationParameters } from 'adhan'
import { getSettings } from '../lib/storage'

export interface PrayerTimeEntry {
  name: string
  time: Date
  key: string
}

const METHOD_MAP: Record<string, () => CalculationParameters> = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  ISNA: CalculationMethod.NorthAmerica,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  UmmAlQura: CalculationMethod.UmmAlQura,
  Dubai: CalculationMethod.Dubai,
  Kuwait: CalculationMethod.Kuwait,
  Qatar: CalculationMethod.Qatar,
  Singapore: CalculationMethod.Singapore,
  Tehran: CalculationMethod.Tehran,
  Turkey: CalculationMethod.Turkey,
}

function applyOffset(date: Date, minutes: number): Date {
  const d = new Date(date.getTime())
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

export function usePrayerTimes(lat: number | null, lng: number | null) {
  const [prayers, setPrayers] = useState<PrayerTimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (lat === null || lng === null) return

    const calculate = async () => {
      const settings = await getSettings()
      const coords = new Coordinates(lat, lng)
      const methodFn = METHOD_MAP[settings.method] || CalculationMethod.MuslimWorldLeague
      const params = methodFn()
      const date = new Date()
      const pt = new PrayerTimes(coords, date, params)
      const adj = settings.adjustments || {}

      setPrayers([
        { name: 'Fajr', time: applyOffset(pt.fajr, adj.fajr || 0), key: 'fajr' },
        { name: 'Sunrise', time: applyOffset(pt.sunrise, adj.sunrise || 0), key: 'sunrise' },
        { name: 'Dhuhr', time: applyOffset(pt.dhuhr, adj.dhuhr || 0), key: 'dhuhr' },
        { name: 'Asr', time: applyOffset(pt.asr, adj.asr || 0), key: 'asr' },
        { name: 'Maghrib', time: applyOffset(pt.maghrib, adj.maghrib || 0), key: 'maghrib' },
        { name: 'Isha', time: applyOffset(pt.isha, adj.isha || 0), key: 'isha' },
      ])
      setLoading(false)
    }

    calculate()
  }, [lat, lng])

  return { prayers, loading }
}
