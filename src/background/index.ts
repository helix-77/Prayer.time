import { Coordinates, PrayerTimes, CalculationMethod, CalculationParameters } from 'adhan'

interface StoredSettings {
  latitude: number
  longitude: number
  method: string
  notifications: boolean
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

const PRAYER_NAMES: Record<string, string> = {
  fajr: 'Fajr',
  sunrise: 'Sunrise',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
}

async function getSettings(): Promise<StoredSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get('settings', (result: { [key: string]: StoredSettings }) => {
      resolve(result.settings ?? { latitude: 0, longitude: 0, method: 'MuslimWorldLeague', notifications: true })
    })
  })
}

function schedulePrayerAlarms() {
  getSettings().then((settings) => {
    if (!settings.latitude || !settings.longitude || !settings.notifications) return

    const coords = new Coordinates(settings.latitude, settings.longitude)
    const methodFn = METHOD_MAP[settings.method] || CalculationMethod.MuslimWorldLeague
    const params = methodFn()
    const now = new Date()
    const pt = new PrayerTimes(coords, now, params)

    const prayers = [
      { key: 'fajr', time: pt.fajr },
      { key: 'dhuhr', time: pt.dhuhr },
      { key: 'asr', time: pt.asr },
      { key: 'maghrib', time: pt.maghrib },
      { key: 'isha', time: pt.isha },
    ]

    chrome.alarms.clearAll(() => {
      for (const p of prayers) {
        if (p.time > now) {
          chrome.alarms.create(`prayer-${p.key}`, { when: p.time.getTime() })
        }
      }
      // Reschedule at midnight
      const midnight = new Date(now)
      midnight.setDate(midnight.getDate() + 1)
      midnight.setHours(0, 1, 0, 0)
      chrome.alarms.create('daily-reschedule', { when: midnight.getTime() })
    })
  })
}

chrome.runtime.onInstalled.addListener(() => {
  schedulePrayerAlarms()
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-reschedule') {
    schedulePrayerAlarms()
    return
  }

  if (alarm.name.startsWith('prayer-')) {
    const prayerKey = alarm.name.replace('prayer-', '')
    const name = PRAYER_NAMES[prayerKey] || prayerKey

    chrome.notifications.create(alarm.name, {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: `🕌 ${name} Time`,
      message: `It's time for ${name} prayer.`,
      priority: 2,
    })
  }
})

// Also reschedule when storage changes (user updates settings)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    schedulePrayerAlarms()
  }
})
