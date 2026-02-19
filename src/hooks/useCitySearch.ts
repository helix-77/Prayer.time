import { useState, useEffect } from 'react'

interface SearchResult {
  display_name: string
  lat: string
  lon: string
}

export function useCitySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
          { headers: { 'User-Agent': 'RamadanTimeExtension/1.0' } }
        )
        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error('Search failed', err)
      } finally {
        setLoading(false)
      }
    }, 500) // Debounce

    return () => clearTimeout(timer)
  }, [query])

  return { query, setQuery, results, loading }
}
