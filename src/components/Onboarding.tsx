import { useCitySearch } from '../hooks/useCitySearch'
import { saveSettings, getSettings } from '../lib/storage'

interface OnboardingProps {
    onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const { query, setQuery, results, loading } = useCitySearch()

    const handleSelect = async (city: any) => {
        const settings = await getSettings()
        await saveSettings({
            ...settings,
            latitude: parseFloat(city.lat),
            longitude: parseFloat(city.lon),
            locationName: city.display_name.split(',')[0]
        })
        onComplete()
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in relative z-10">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-gray-200">
                <span className="text-3xl">🌙</span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-outfit">Ramadan Time</h1>
            <p className="text-gray-500 mb-8 max-w-[240px]">
                Enter your city to calculate accurate prayer times.
            </p>

            <div className="w-full relative">
                <input
                    type="text"
                    placeholder="Search city (e.g. London)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all font-medium placeholder-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />

                {/* Results Dropdown */}
                {(results.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 max-h-[200px] overflow-y-auto no-scrollbar">
                        {results.map((city, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(city)}
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
                {loading && <div className="absolute right-4 top-3.5 text-xs text-gray-400">...</div>}
            </div>
        </div>
    )
}
