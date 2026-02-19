import { useState, useCallback, useEffect } from 'react'
import './index.css'
import Dashboard from './components/Dashboard'
import Onboarding from './components/Onboarding'
import SettingsModal from './components/SettingsModal'
import { usePrayerTimes } from './hooks/usePrayerTimes'
import { useCountdown } from './hooks/useCountdown'
import { getSettings } from './lib/storage'

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // State for location
  const [locationName, setLocationName] = useState<string | null>(null) // null = loading
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)

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
    })
  }, [refreshKey])

  const { prayers } = usePrayerTimes(
    coords?.lat ?? null,
    coords?.lng ?? null
  )
  const countdown = useCountdown(prayers)

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
    </>
  )
}
