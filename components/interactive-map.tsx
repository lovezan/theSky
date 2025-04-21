"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Info, X, Compass } from "lucide-react"
import Link from "next/link"
import { fetchCountries, type Country } from "@/lib/api"

export default function InteractiveMap() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "Africa", name: "Africa" },
    { id: "Americas", name: "Americas" },
    { id: "Asia", name: "Asia" },
    { id: "Europe", name: "Europe" },
    { id: "Oceania", name: "Oceania" },
  ]

  // Fetch countries on component mount
  useEffect(() => {
    const getCountries = async () => {
      try {
        setLoading(true)
        const data = await fetchCountries()

        if (data.length === 0) {
          setError("No country data available. Please try again later.")
        } else {
          setCountries(data)
        }
        setLoading(false)
      } catch (err) {
        console.error("Error in component:", err)
        setError("Failed to fetch countries. Please try again later.")
        setLoading(false)
      }
    }

    getCountries()
  }, [])

  // Filter countries based on search query and selected region
  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  // Handle map zoom
  const handleZoom = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY
    const newScale = delta > 0 ? Math.max(mapPosition.scale - 0.1, 0.5) : Math.min(mapPosition.scale + 0.1, 3)

    setMapPosition({
      ...mapPosition,
      scale: newScale,
    })
  }

  // Handle map drag start
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartDragPosition({ x: e.clientX, y: e.clientY })
  }

  // Handle map drag
  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - startDragPosition.x
    const dy = e.clientY - startDragPosition.y

    setMapPosition({
      ...mapPosition,
      x: mapPosition.x + dx,
      y: mapPosition.y + dy,
    })

    setStartDragPosition({ x: e.clientX, y: e.clientY })
  }

  // Handle map drag end
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Reset map position
  const resetMapPosition = () => {
    setMapPosition({ x: 0, y: 0, scale: 1 })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6 overflow-hidden">
      <div className="flex flex-col space-y-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region.id}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedRegion === region.id
                    ? "bg-purple-600 text-white"
                    : "bg-black/30 text-white/70 hover:bg-black/50 hover:text-white"
                }`}
                onClick={() => setSelectedRegion(region.id)}
              >
                {region.name}
              </button>
            ))}
          </div>

          <button
            onClick={resetMapPosition}
            className="flex items-center justify-center p-2 bg-black/30 border border-white/10 rounded-lg hover:bg-black/50 transition-all duration-300"
            title="Reset view"
          >
            <Compass className="h-5 w-5 text-white/70" />
          </button>
        </div>

        {/* Map container */}
        <div
          ref={mapContainerRef}
          className="relative h-[500px] overflow-hidden rounded-lg border border-white/10 bg-black/20"
          onWheel={handleZoom}
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              x: mapPosition.x,
              y: mapPosition.y,
              scale: mapPosition.scale,
              transformOrigin: "center",
            }}
          >
            {/* World map background */}
            <div className="absolute inset-0 bg-[url('/world-map-outline.svg')] bg-no-repeat bg-center bg-contain opacity-20"></div>

            {/* Country markers */}
            {filteredCountries.map((country) => {
              // Convert lat/lng to x/y coordinates (simple approximation)
              const x = ((country.latlng[1] + 180) / 360) * 100
              const y = ((90 - country.latlng[0]) / 180) * 100

              return (
                <motion.div
                  key={country.alpha3Code}
                  className="absolute"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => setSelectedCountry(country)}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-purple-500 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/20 cursor-pointer`}
                  ></div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Hover tooltip */}
          {hoveredCountry && (
            <div
              className="absolute z-10 bg-black/80 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
              style={{
                left: `${((hoveredCountry.latlng[1] + 180) / 360) * 100 * mapPosition.scale + mapPosition.x}%`,
                top: `${((90 - hoveredCountry.latlng[0]) / 180) * 100 * mapPosition.scale + mapPosition.y - 10}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-medium">{hoveredCountry.name}</div>
              <div className="text-xs text-white/70">{hoveredCountry.region}</div>
            </div>
          )}

          {/* Selected country info */}
          {selectedCountry && (
            <motion.div
              className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white z-20"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <img
                    src={selectedCountry.flags.png || "/placeholder.svg"}
                    alt={`Flag of ${selectedCountry.name}`}
                    className="w-8 h-6 mr-3 object-cover rounded-sm border border-white/10"
                  />
                  <h3 className="text-lg font-bold">{selectedCountry.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span className="text-white/60">Capital:</span> {selectedCountry.capital}
                </div>
                <div>
                  <span className="text-white/60">Region:</span> {selectedCountry.region}
                </div>
                <div>
                  <span className="text-white/60">Population:</span> {selectedCountry.population.toLocaleString()}
                </div>
                <div>
                  <span className="text-white/60">Area:</span> {selectedCountry.area?.toLocaleString() || "N/A"} km²
                </div>
              </div>

              <Link
                href={`/blogs/${selectedCountry.alpha3Code}`}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white flex items-center justify-center space-x-2 transition-colors"
              >
                <Info className="h-4 w-4" />
                <span>View Country Guide</span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-white/60">
          Showing {filteredCountries.length} of {countries.length} countries
        </div>
      </div>
    </div>
  )
}
