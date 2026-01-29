'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar'
import BookResultCard from '../components/BookResultCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'

export default function SearchPage() {
  const params = useSearchParams()
  const initialQuery = params.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchBooks = async () => {
    if (!query) return
    setLoading(true)

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/books/search?q=${query}&lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
      )
      const data = await res.json()
      setResults(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (initialQuery) fetchBooks()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Search books near you
      </h2>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={fetchBooks}
        loading={loading}
      />

      <div className="mt-8 space-y-4">
        {loading && <LoadingSkeleton />}
        {!loading && results.length === 0 && <EmptyState />}

        {results.map((book, i) => (
          <BookResultCard key={i} book={book} />
        ))}
      </div>
    </div>
  )
}
