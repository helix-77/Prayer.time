export interface Settings {
  latitude: number
  longitude: number
  method: string
  notifications: boolean
  locationName?: string
  adjustments: Record<string, number>
}

const DEFAULTS: Settings = {
  latitude: 21.4225, // Makkah
  longitude: 39.8262,
  method: 'MuslimWorldLeague',
  notifications: true,
  locationName: '', // Empty triggers onboarding
  adjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
}

function isExtension(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage
}

export async function getSettings(): Promise<Settings> {
  if (!isExtension()) {
    const raw = localStorage.getItem('ramadan-settings')
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
  }
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', (result) => {
      resolve(result.settings ? { ...DEFAULTS, ...result.settings } : DEFAULTS)
    })
  })
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings()
  const merged = { ...current, ...settings }
  if (!isExtension()) {
    localStorage.setItem('ramadan-settings', JSON.stringify(merged))
    return
  }
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings: merged }, resolve)
  })
}
