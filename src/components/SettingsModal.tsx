import { useState, useEffect } from 'react'
import { getSettings, saveSettings, type Settings } from '../lib/storage'
import { useCitySearch } from '../hooks/useCitySearch'
import { requestNotificationPermission, getNotificationPermission } from '../lib/notifications'

const METHODS = [
    { id: 'MuslimWorldLeague', label: 'Muslim World League' },
    { id: 'ISNA', label: 'ISNA (North America)' },
    { id: 'Egyptian', label: 'Egyptian General Authority' },
    { id: 'Karachi', label: 'University of Karachi' },
    { id: 'UmmAlQura', label: 'Umm al-Qura (Makkah)' },
    { id: 'Dubai', label: 'Dubai' },
    { id: 'Kuwait', label: 'Kuwait' },
    { id: 'Qatar', label: 'Qatar' },
    { id: 'Singapore', label: 'Singapore' },
    { id: 'Tehran', label: 'Tehran' },
    { id: 'Turkey', label: 'Diyanet (Turkey)' },
]

const PRAYER_KEYS = [
    { key: 'fajr', label: 'Fajr' },
    { key: 'sunrise', label: 'Sunrise' },
    { key: 'dhuhr', label: 'Dhuhr' },
    { key: 'asr', label: 'Asr' },
    { key: 'maghrib', label: 'Maghrib' },
    { key: 'isha', label: 'Isha' },
]

interface SettingsModalProps {
    open: boolean
    onClose: () => void
    onSave: () => void
}

export default function SettingsModal({ open, onClose, onSave }: SettingsModalProps) {
    const [form, setForm] = useState<Settings>({
        latitude: 0,
        longitude: 0,
        method: 'MuslimWorldLeague',
        notifications: true,
        popupNotifications: false,
        popupDurationMinutes: 15,
        osNotifications: false,
        locationName: '',
        adjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    })
    const [notifPerm, setNotifPerm] = useState<NotificationPermission | 'unsupported'>('default')

    useEffect(() => {
        setNotifPerm(getNotificationPermission())
    }, [open])

    const { query, setQuery, results, loading: searchLoading } = useCitySearch()

    useEffect(() => {
        if (open) {
            getSettings().then(setForm)
        }
    }, [open])

    const selectCity = (city: any) => {
        setForm(f => ({
            ...f,
            latitude: parseFloat(city.lat),
            longitude: parseFloat(city.lon),
            locationName: city.display_name.split(',')[0]
        }))
        setQuery('')
    }

    const adjustPrayer = (key: string, delta: number) => {
        setForm(f => ({
            ...f,
            adjustments: {
                ...f.adjustments,
                [key]: (f.adjustments[key] || 0) + delta,
            },
        }))
    }

    const handleSave = async () => {
        await saveSettings(form)
        onSave()
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end animate-fade-in backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white w-full rounded-t-3xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <span className="font-bold text-xl text-gray-900 font-outfit">Settings</span>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto overflow-x-hidden flex-1 space-y-6">

                    {/* Location Section */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Location
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search new city..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all font-medium"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            {/* Search Results */}
                            {(results.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 max-h-[200px] overflow-y-auto">
                                    {results.map((city, i) => (
                                        <button
                                            key={i}
                                            onClick={() => selectCity(city)}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 truncate">
                                                    {city.display_name.split(',')[0]}
                                                </span>
                                                <span className="text-xs text-gray-400 truncate">
                                                    {city.display_name.split(',').slice(1).join(',')}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {searchLoading && <div className="absolute right-4 top-3.5 text-xs text-gray-400">...</div>}
                        </div>

                        <div className="mt-3 flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-lg">📍</span>
                            <span className="text-sm font-medium text-gray-900 truncate">
                                {form.locationName || 'No location set'}
                            </span>
                        </div>
                    </div>

                    {/* Method Section */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Calculation Method
                        </label>
                        <div className="relative">
                            <select
                                value={form.method}
                                onChange={(e) => setForm(f => ({ ...f, method: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 font-medium text-gray-900"
                            >
                                {METHODS.map(m => (
                                    <option key={m.id} value={m.id}>{m.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Fine-Tune Prayer Times */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Fine-Tune Prayer Times
                        </label>
                        <p className="text-[11px] text-gray-400 mb-3">Adjust each prayer time by minutes (±)</p>
                        <div className="space-y-2">
                            {PRAYER_KEYS.map(({ key, label }) => {
                                const val = form.adjustments[key] || 0
                                return (
                                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-sm font-medium text-gray-900">{label}</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => adjustPrayer(key, -1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm font-bold"
                                            >
                                                −
                                            </button>
                                            <span className={`font-outfit text-sm font-semibold w-10 text-center ${val > 0 ? 'text-emerald-600' : val < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {val > 0 ? `+${val}` : val}
                                            </span>
                                            <button
                                                onClick={() => adjustPrayer(key, 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                            Notifications
                        </label>
                        <div className="space-y-2">
                            {/* Enable Alarms + Browser Alert — combined */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">Enable Alerts</span>
                                        <span className="text-[11px] text-gray-400 mt-0.5">Alarms &amp; OS-level browser notifications</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={form.notifications}
                                            onChange={async (e) => {
                                                const enabled = e.target.checked
                                                if (enabled && notifPerm !== 'granted') {
                                                    const perm = await requestNotificationPermission()
                                                    setNotifPerm(perm)
                                                    setForm(f => ({ ...f, notifications: enabled, osNotifications: perm === 'granted' }))
                                                } else {
                                                    setForm(f => ({ ...f, notifications: enabled, osNotifications: enabled }))
                                                }
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                                    </label>
                                </div>

                                {/* Permission status badge */}
                                {form.notifications && notifPerm === 'denied' && (
                                    <p className="text-[11px] text-red-500 font-medium">
                                        ⚠️ Blocked in browser settings — allow notifications for this site to enable.
                                    </p>
                                )}
                                {form.notifications && notifPerm === 'granted' && (
                                    <p className="text-[11px] text-emerald-600 font-medium">✓ Browser permission granted</p>
                                )}
                                {form.notifications && notifPerm === 'unsupported' && (
                                    <p className="text-[11px] text-gray-400">OS notifications not supported in this browser — alarms only.</p>
                                )}
                            </div>

                            {/* In-app Popup */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">Small Popup Reminder</span>
                                    <span className="text-[11px] text-gray-400 mt-0.5">Pill overlay &amp; chime when app is open (automatically dismissed later)</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={form.popupNotifications}
                                        onChange={(e) => setForm(f => ({ ...f, popupNotifications: e.target.checked }))}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                                </label>
                            </div>

                            {/* Popup Duration — only visible when popup is enabled */}
                            {form.popupNotifications && (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">Popup Duration</span>
                                        <span className="text-[11px] text-gray-400 mt-0.5">Minutes before auto-dismiss</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setForm(f => ({ ...f, popupDurationMinutes: Math.max(1, (f.popupDurationMinutes ?? 15) - 1) }))}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm font-bold"
                                        >
                                            −
                                        </button>
                                        <span className="font-outfit text-sm font-semibold w-8 text-center text-gray-900">
                                            {form.popupDurationMinutes ?? 15}
                                        </span>
                                        <button
                                            onClick={() => setForm(f => ({ ...f, popupDurationMinutes: Math.min(60, (f.popupDurationMinutes ?? 15) + 1) }))}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors text-sm font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                <div className="p-6 pt-0">
                    <button
                        onClick={handleSave}
                        className="w-full bg-gray-900 text-white rounded-xl py-4 font-bold text-sm tracking-wide hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        SAVE SETTINGS
                    </button>
                </div>
            </div>
        </div>
    )
}
