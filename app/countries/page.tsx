"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { fetchCountries, type Country } from "@/lib/api"
import { CountryCard } from "@/components/countries/country-card"
import { useSearchParams } from "next/navigation"

export default function CountriesPage() {
  const searchParams = useSearchParams()
  const initialSearchQuery = searchParams.get("search") || ""

  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [activeRegion, setActiveRegion] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [populationRange, setPopulationRange] = useState<[number, number]>([0, 2000000000])
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])

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
          setFilteredCountries(data)

          // Extract all available languages
          const languages = new Set<string>()
          data.forEach((country) => {
            country.languages.forEach((lang) => {
              languages.add(lang.name)
            })
          })
          setAvailableLanguages(Array.from(languages).sort())

          // Set max population for range
          const maxPopulation = Math.max(...data.map((country) => country.population))
          setPopulationRange([0, maxPopulation])
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

  // Filter and sort countries
  useEffect(() => {
    let result = [...countries]

    // Filter by region
    if (activeRegion !== "all") {
      result = result.filter((country) => country.region === activeRegion)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (country) =>
          country.name.toLowerCase().includes(query) ||
          country.capital?.toLowerCase().includes(query) ||
          country.region.toLowerCase().includes(query) ||
          country.subregion.toLowerCase().includes(query),
      )
    }

    // Filter by population range
    result = result.filter(
      (country) => country.population >= populationRange[0] && country.population <= populationRange[1],
    )

    // Filter by selected languages
    if (selectedLanguages.length > 0) {
      result = result.filter((country) => country.languages.some((lang) => selectedLanguages.includes(lang.name)))
    }

    // Sort countries
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "population":
          comparison = a.population - b.population
          break
        case "area":
          comparison = (a.area || 0) - (b.area || 0)
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredCountries(result)
  }, [searchQuery, activeRegion, countries, populationRange, sortBy, sortOrder, selectedLanguages])

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((lang) => lang !== language) : [...prev, language],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setActiveRegion("all")
    setPopulationRange([0, Math.max(...countries.map((country) => country.population))])
    setSortBy("name")
    setSortOrder("asc")
    setSelectedLanguages([])
  }

  const formatPopulation = (population: number) => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)}B`
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(1)}K`
    }
    return population.toString()
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-white/90 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore Countries</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover detailed information about countries around the world. Click on any country to read our travel
            guide.
          </p>
        </motion.div>

        {/* Search and Basic Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Bar */}
            <motion.form
              className="relative w-full md:w-96"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/50" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200 text-white"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.form>

            {/* Region Filters */}
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {regions.map((region) => (
                <button
                  key={region.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeRegion === region.id
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setActiveRegion(region.id)}
                >
                  {region.name}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-all duration-300"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <motion.div
            className="max-w-6xl mx-auto mb-12 bg-white/5 border border-white/10 rounded-lg p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-md text-white/70 hover:text-white text-sm transition-all duration-300"
              >
                <X className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Population Range */}
              <div>
                <label className="block text-white font-medium mb-2">Population Range</label>
                <div className="space-y-4">
                  <div className="flex justify-between text-white/70 text-sm">
                    <span>{formatPopulation(populationRange[0])}</span>
                    <span>{formatPopulation(populationRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(...countries.map((country) => country.population))}
                    value={populationRange[1]}
                    onChange={(e) => setPopulationRange([populationRange[0], Number.parseInt(e.target.value)])}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-white font-medium mb-2">Sort By</label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <option value="name">Name</option>
                    <option value="population">Population</option>
                    <option value="area">Area</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {sortOrder === "asc" ? "A→Z" : "Z→A"}
                  </button>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-white font-medium mb-2">Languages</label>
                <div className="bg-white/5 border border-white/10 rounded-md p-3 h-32 overflow-y-auto">
                  <div className="space-y-2">
                    {availableLanguages.slice(0, 10).map((language) => (
                      <div key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`lang-${language}`}
                          checked={selectedLanguages.includes(language)}
                          onChange={() => toggleLanguage(language)}
                          className="mr-2 h-4 w-4 rounded border-white/20 bg-white/5 text-white focus:ring-0"
                        />
                        <label htmlFor={`lang-${language}`} className="text-white/70 text-sm">
                          {language}
                        </label>
                      </div>
                    ))}
                    {availableLanguages.length > 10 && (
                      <div className="text-white/50 text-xs pt-1">+{availableLanguages.length - 10} more languages</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Summary */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            <p className="text-white/70">
              Showing <span className="text-white font-medium">{filteredCountries.length}</span> of{" "}
              <span className="text-white font-medium">{countries.length}</span> countries
            </p>
            {(searchQuery ||
              activeRegion !== "all" ||
              selectedLanguages.length > 0 ||
              populationRange[0] > 0 ||
              populationRange[1] < Math.max(...countries.map((country) => country.population))) && (
              <button
                onClick={clearFilters}
                className="text-white/70 hover:text-white text-sm underline transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCountries.map((country, index) => (
                <CountryCard key={country.alpha3Code} country={country} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">No countries found</h3>
              <p className="text-white/70">Try adjusting your search or filter to find what you're looking for.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
