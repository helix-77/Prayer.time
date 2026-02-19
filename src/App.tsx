import { useState, useCallback, useEffect, useRef } from 'react'
import './index.css'
import Dashboard from './components/Dashboard'
import Onboarding from './components/Onboarding'
import SettingsModal from './components/SettingsModal'
import PrayerPopup from './components/PrayerPopup'
import { usePrayerTimes } from './hooks/usePrayerTimes'
import { useCountdown } from './hooks/useCountdown'
import { getSettings } from './lib/storage'
import { playBeep, showPrayerNotification } from './lib/notifications'
import type { PrayerTimeEntry } from './hooks/usePrayerTimes'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // State for location
  const [locationName, setLocationName] = useState<string | null>(null) // null = loading
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)

  // Popup notification state
  const [popupPrayer, setPopupPrayer] = useState<PrayerTimeEntry | null>(null)
  const [popupEnabled, setPopupEnabled] = useState(false)
  const [osNotifEnabled, setOsNotifEnabled] = useState(false)
  const [popupDuration, setPopupDuration] = useState(15)
  // Tracks which prayer keys have already triggered a popup today
  const notifiedRef = useRef<Set<string>>(new Set())

  // Load Settings
  useEffect(() => {
    getSettings().then(s => {
      // If locationName is empty, it means we need onboarding
      if (!s.locationName) {
        setLocationName('') // Empty string signals onboarding
        setCoords(null)
      } else {
        setLocationName(s.locationName)
        setCoords({ lat: s.latitude, lng: s.longitude })
      }
      setPopupEnabled(s.popupNotifications ?? false)
      setPopupDuration(s.popupDurationMinutes ?? 15)
      setOsNotifEnabled(s.osNotifications ?? false)
    })
  }, [refreshKey])

  const { prayers } = usePrayerTimes(
    coords?.lat ?? null,
    coords?.lng ?? null,
    refreshKey
  )
  const countdown = useCountdown(prayers)

  // Reset notified set at midnight so prayers can trigger again next day
  useEffect(() => {
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - now.getTime()
    const t = setTimeout(() => {
      notifiedRef.current = new Set()
    }, msUntilMidnight)
    return () => clearTimeout(t)
  }, [])

  // Check every 30 seconds whether any prayer time has just arrived
  useEffect(() => {
    if ((!popupEnabled && !osNotifEnabled) || prayers.length === 0) return

    const check = () => {
      const now = Date.now()
      for (const prayer of prayers) {
        const prayerMs = prayer.time.getTime()
        // Trigger if current time is within [prayerTime, prayerTime + 60s]
        if (now >= prayerMs && now < prayerMs + 60_000) {
          if (!notifiedRef.current.has(prayer.key)) {
            notifiedRef.current.add(prayer.key)
            if (popupEnabled) {
              setPopupPrayer(prayer)
              playBeep()
            }
            if (osNotifEnabled) {
              showPrayerNotification(prayer.name, prayer.time)
            }
          }
        }
      }
    }

    check() // run immediately on mount / when prayers change
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [popupEnabled, osNotifEnabled, prayers])

  const handleRefresh = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  // If locationName is null, we are loading.
  if (locationName === null) return null

  // If locationName is empty string, show Onboarding
  if (locationName === '') {
    return <Onboarding onComplete={handleRefresh} />
  }

  // Otherwise show Dashboard
  return (
    <>
      <Dashboard
        locationName={locationName}
        onLocationClick={() => setSettingsOpen(true)}
        countdown={countdown}
        prayers={prayers}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleRefresh}
      />
      {popupPrayer && (
        <PrayerPopup
          prayerName={popupPrayer.name}
          prayerTime={popupPrayer.time}
          durationMinutes={popupDuration}
          onClose={() => setPopupPrayer(null)}
        />
      )}
    </>
  )
}
