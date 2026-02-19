import { useState, useEffect, useRef } from 'react'
import type { PrayerTimeEntry } from './usePrayerTimes'

interface CountdownState {
  hours: number
  minutes: number
  seconds: number
  label: string
  targetPrayer: string
}

const SPECIAL_LABELS: Record<string, string> = {
  fajr: 'Until Suhoor Ends',
  maghrib: 'Until Iftar',
}

export function useCountdown(prayers: PrayerTimeEntry[]): CountdownState | null {
  const [state, setState] = useState<CountdownState | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (prayers.length === 0) return

    const tick = () => {
      const now = new Date()

      // Find the next upcoming prayer
      const nextPrayer = prayers.find((p) => p.time > now)

      let target: Date
      let label: string
      let targetPrayer: string

      if (nextPrayer) {
        target = nextPrayer.time
        targetPrayer = nextPrayer.name
        label = SPECIAL_LABELS[nextPrayer.key] || `Until ${nextPrayer.name}`
      } else {
        // All prayers have passed today — count to tomorrow's Fajr
        const fajr = prayers.find((p) => p.key === 'fajr')
        if (!fajr) return
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(fajr.time.getHours(), fajr.time.getMinutes(), 0, 0)
        target = tomorrow
        label = 'Until Suhoor Ends'
        targetPrayer = 'Fajr'
      }

      const diff = target.getTime() - now.getTime()
      if (diff <= 0) return

      const totalSeconds = Math.floor(diff / 1000)
      setState({
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        label,
        targetPrayer,
      })
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [prayers])

  return state
}
