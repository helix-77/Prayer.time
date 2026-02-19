import { format } from 'date-fns'
import type { PrayerTimeEntry } from '../hooks/usePrayerTimes'

interface DashboardProps {
    locationName: string
    onLocationClick: () => void
    countdown: { hours: number; minutes: number; seconds: number; label: string } | null
    prayers: PrayerTimeEntry[]
}

const ICONS: Record<string, string> = {
    fajr: '🌙', sunrise: '🌅', dhuhr: '☀️', asr: '🌤️', maghrib: '🌇', isha: '🌃',
}

// function getRelativeTime(prayerTime: Date, now: Date): string | null {
//     const diff = prayerTime.getTime() - now.getTime()
//     if (diff <= 0) return null
//     const totalMin = Math.floor(diff / 60000)
//     const h = Math.floor(totalMin / 60)
//     const m = totalMin % 60
//     if (h > 0) return `in ${h}h ${m}m`
//     return `in ${m}m`
// }

export default function Dashboard({ locationName, onLocationClick, countdown, prayers }: DashboardProps) {
    const now = new Date()
    const nextPrayerIndex = prayers.findIndex(p => p.time > now)
    const activeIndex = nextPrayerIndex === -1 ? 0 : nextPrayerIndex

    const fajr = prayers.find(p => p.key === 'fajr')
    const maghrib = prayers.find(p => p.key === 'maghrib')

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in relative">

            {/* Header */}
            <div className="flex justify-between items-start mb-10">
                <div className="flex flex-col cursor-pointer group" onClick={onLocationClick}>
                    <div className="flex items-center gap-1">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight group-hover:underline decoration-2 underline-offset-4 decoration-gray-900">{locationName}</h2>
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">
                        {format(new Date(), 'EEEE, d MMMM')}
                    </p>
                </div>

                <button onClick={onLocationClick} className="p-2 -mr-2 text-gray-300 hover:text-gray-900 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>



            {/* Hero: Countdown */}
            <div className="text-center mb-12 relative z-0">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em] mb-4">
                    {countdown?.label || 'UPCOMING PRAYER'}
                </p>
                <div className="font-outfit text-7xl font-bold text-gray-900 tracking-tighter leading-none flex items-baseline justify-center gap-1">
                    {countdown ? (
                        <>
                            <span>{String(countdown.hours).padStart(2, '0')}</span>
                            <span className="text-gray-200 animate-pulse">:</span>
                            <span>{String(countdown.minutes).padStart(2, '0')}</span>
                            <span className="text-2xl text-gray-300 ml-1 font-medium">{String(countdown.seconds).padStart(2, '0')}</span>
                        </>
                    ) : (
                        <span className="text-gray-200">--:--</span>
                    )}
                </div>
            </div>

            {/* Suhoor & Iftar Badges */}
            <div className="flex gap-3 mb-3">
                <div className="flex-1 bg-indigo-50 rounded-xl px-4 py-5 flex items-center justify-between border border-indigo-100">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🍽️</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Suhoor</span>
                    </div>
                    <span className="font-outfit text-sm font-semibold text-indigo-700">
                        {fajr ? format(fajr.time, 'h:mm a') : '--'}
                    </span>
                </div>
                <div className="flex-1 bg-amber-50 rounded-xl px-4 py-5 flex items-center justify-between border border-amber-100">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">🌙</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Iftar</span>
                    </div>
                    <span className="font-outfit text-sm font-semibold text-amber-700">
                        {maghrib ? format(maghrib.time, 'h:mm a') : '--'}
                    </span>
                </div>
            </div>

            {/* Grid: Prayer Times */}
            <div className="grid grid-cols-2 gap-3 flex-1 pb-4">
                {prayers.map((p, i) => {
                    const isActive = i === activeIndex
                    // const isPast = p.time <= now
                    // const relative = getRelativeTime(p.time, now)
                    return (
                        <div
                            key={p.key}
                            className={`
                rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300
                ${isActive
                                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 scale-105 z-10'
                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }
              `}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${isActive ? 'opacity-100' : 'opacity-50'}`}>{ICONS[p.key]}</span>
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{p.name}</span>
                                    {/* {isPast ? (
                                        <span className={`text-[9px] ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>✓ passed</span>
                                    ) : relative ? (
                                        <span className={`text-[9px] ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>{relative}</span>
                                    ) : null} */}
                                </div>
                            </div>
                            <span className={`font-outfit text-sm font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                {format(p.time, 'h:mm a')}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
