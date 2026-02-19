import { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'

interface PrayerPopupProps {
    prayerName: string
    prayerTime: Date
    durationMinutes: number
    onClose: () => void
}

const PRAYER_ICONS: Record<string, string> = {
    Fajr: '🌙',
    Sunrise: '🌅',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌇',
    Isha: '🌃',
}

export default function PrayerPopup({ prayerName, prayerTime, durationMinutes, onClose }: PrayerPopupProps) {
    const totalMs = durationMinutes * 60 * 1000
    const [remaining, setRemaining] = useState(totalMs)
    const [visible, setVisible] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Slide in on mount
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50)
        return () => clearTimeout(t)
    }, [])

    // Countdown timer — auto-dismiss
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1000) {
                    clearInterval(intervalRef.current!)
                    setVisible(false)
                    setTimeout(onClose, 300)
                    return 0
                }
                return prev - 1000
            })
        }, 1000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const progress = (remaining / totalMs) * 100
    const remainingSecs = Math.ceil(remaining / 1000)
    const displayTime = remainingSecs >= 60
        ? `${Math.ceil(remainingSecs / 60)}m`
        : `${remainingSecs}s`
    const icon = PRAYER_ICONS[prayerName] ?? '🕌'

    return (
        <div
            className={`
                fixed bottom-4 right-4 z-[9999]
                flex items-center gap-2.5
                pl-3 pr-4 py-2.5
                rounded-full
                bg-gray-900/90 backdrop-blur-sm
                shadow-lg shadow-black/20
                pointer-events-none
                transition-all duration-300 ease-out
                ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
            `}
        >
            {/* Icon */}
            <span className="text-base leading-none">{icon}</span>

            {/* Text */}
            <div className="flex items-baseline gap-1.5">
                <span className="text-white text-xs font-semibold font-outfit">
                    {prayerName}
                </span>
                <span className="text-gray-400 text-[11px] font-medium">
                    {format(prayerTime, 'h:mm a')}
                </span>
            </div>

            {/* Circular progress ring */}
            <div className="relative w-5 h-5 flex-shrink-0">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                    <circle
                        cx="10" cy="10" r="8"
                        fill="none"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 8}`}
                        strokeDashoffset={`${2 * Math.PI * 8 * (1 - progress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white leading-none">
                    {displayTime}
                </span>
            </div>
        </div>
    )
}
