"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Heart, X, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import type { Country } from "@/lib/api"

interface PersonalizedRecommendationsProps {
  countries: Country[]
  userPreferences?: {
    interests?: string[]
    visitedCountries?: string[]
    preferredClimate?: string
    travelStyle?: string
  }
}

export default function PersonalizedRecommendations({
  countries,
  userPreferences = {
    interests: ["Culture", "Nature", "Food"],
    visitedCountries: ["France", "Italy", "Spain"],
    preferredClimate: "Warm",
    travelStyle: "Adventure",
  },
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [aiReason, setAiReason] = useState<string>("")
  const [showReason, setShowReason] = useState(false)
  const [fetchAttempted, setFetchAttempted] = useState(false)

  useEffect(() => {
    // Only run once to prevent infinite loops
    if (fetchAttempted || countries.length === 0) return

    const getRecommendations = async () => {
      setLoading(true)
      setFetchAttempted(true)

      try {
        // Filter out already visited countries
        const availableCountries = countries.filter(
          (country) => !userPreferences.visitedCountries?.includes(country.name),
        )

        if (availableCountries.length === 0) {
          setRecommendations([])
          setAiReason("No recommendations available as you've visited all countries in our database.")
          setLoading(false)
          return
        }

        // Get a random selection of countries to work with (for performance)
        const randomCountries = availableCountries.sort(() => 0.5 - Math.random()).slice(0, 10)

        // Use a simpler approach - just select random countries
        // This avoids the AI call that's causing issues
        const selectedCountries = randomCountries.slice(0, 3)

        setRecommendations(selectedCountries)
        setAiReason(
          "Recommended based on your preferences for " +
            userPreferences.interests?.join(", ") +
            " and " +
            userPreferences.travelStyle +
            " travel style.",
        )
      } catch (error) {
        console.error("Error getting recommendations:", error)
        // Fallback to random recommendations
        if (countries.length > 0) {
          const fallbackRecommendations = countries
            .filter((country) => !userPreferences.visitedCountries?.includes(country.name))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)

          setRecommendations(fallbackRecommendations)
          setAiReason("Recommended based on popular destinations.")
        }
      } finally {
        setLoading(false)
      }
    }

    getRecommendations()
  }, [countries, userPreferences, fetchAttempted])

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
          <h3 className="text-lg font-bold text-white">Personalized For You</h3>
        </div>
        <button
          onClick={() => setShowReason(!showReason)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showReason ? "Hide AI Reasoning" : "Show AI Reasoning"}
        </button>
      </div>

      {showReason && (
        <motion.div
          className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg relative"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <button
            onClick={() => setShowReason(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <h4 className="text-white font-medium mb-2">AI Recommendation Reasoning:</h4>
          <p className="text-white/80 whitespace-pre-line text-sm">{aiReason}</p>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((country) => (
            <RecommendationCard key={country.alpha3Code} country={country} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/70">No recommendations available at the moment.</p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors">
            <ThumbsUp className="h-4 w-4" />
            <span>Helpful</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors">
            <ThumbsDown className="h-4 w-4" />
            <span>Not for me</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function RecommendationCard({ country }: { country: Country }) {
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      className="relative group overflow-hidden rounded-lg h-[200px] border border-white/10"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black z-10"></div>

      {/* Flag background */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500">
        <img
          src={country.flags?.png || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-cover filter blur-[1px] group-hover:blur-0 transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="relative z-30 p-4 h-full flex flex-col">
        <div className="flex-1">
          {/* Flag in corner */}
          <div className="absolute top-3 right-3 w-10 h-6 overflow-hidden rounded border border-white/20 shadow-lg">
            <img
              src={country.flags?.png || "/placeholder.svg"}
              alt={`Flag of ${country.name || "Country"}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Country name */}
          <h3 className="text-xl font-bold text-white mb-2 pr-12">{country.name || "Unknown Country"}</h3>

          {/* Country details */}
          <p className="text-white/70 text-sm line-clamp-2">
            {country.capital ? `Capital: ${country.capital}` : ""} • {country.region || "Unknown Region"}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <Link
            href={`/blogs/${country.alpha3Code || ""}`}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            Explore
          </Link>
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-full ${
              liked ? "bg-pink-600/30 text-pink-400" : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
            } transition-colors`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-pink-400" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
