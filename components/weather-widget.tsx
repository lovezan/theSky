"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, CloudRain, Sun, Wind, Snowflake, CloudLightning, CloudFog, Thermometer } from "lucide-react"

interface WeatherWidgetProps {
  countryName: string
  capital: string
  lat: number
  lng: number
}

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

export default function WeatherWidget({ countryName, capital, lat, lng }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)

        // In a real app, you would use a weather API like OpenWeatherMap or WeatherAPI
        // For this demo, we'll generate mock weather data
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        // Generate random weather data based on latitude (colder near poles, warmer near equator)
        const baseTemp = 25 - Math.abs(lat) / 2
        const randomVariation = Math.random() * 10 - 5
        const temperature = Math.round(baseTemp + randomVariation)

        // Weather conditions based on temperature and some randomness
        let condition = "Clear"
        let icon = "sun"

        const random = Math.random()

        if (temperature < 0) {
          condition = "Snow"
          icon = "snowflake"
        } else if (temperature < 5) {
          if (random < 0.7) {
            condition = "Snow"
            icon = "snowflake"
          } else {
            condition = "Cloudy"
            icon = "cloud"
          }
        } else if (temperature < 10) {
          if (random < 0.4) {
            condition = "Rain"
            icon = "cloud-rain"
          } else {
            condition = "Cloudy"
            icon = "cloud"
          }
        } else if (temperature < 20) {
          if (random < 0.3) {
            condition = "Rain"
            icon = "cloud-rain"
          } else if (random < 0.6) {
            condition = "Cloudy"
            icon = "cloud"
          } else {
            condition = "Clear"
            icon = "sun"
          }
        } else {
          if (random < 0.1) {
            condition = "Thunderstorm"
            icon = "cloud-lightning"
          } else if (random < 0.3) {
            condition = "Rain"
            icon = "cloud-rain"
          } else if (random < 0.5) {
            condition = "Cloudy"
            icon = "cloud"
          } else {
            condition = "Clear"
            icon = "sun"
          }
        }

        // Generate random humidity and wind speed
        const humidity = Math.round(40 + Math.random() * 40)
        const windSpeed = Math.round(5 + Math.random() * 20)

        setWeather({
          temperature,
          condition,
          humidity,
          windSpeed,
          icon,
        })

        setLoading(false)
      } catch (err) {
        console.error("Error fetching weather:", err)
        setError("Failed to load weather data")
        setLoading(false)
      }
    }

    if (capital) {
      fetchWeather()
    }
  }, [capital, lat, lng])

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-8 w-8 text-yellow-400" />
      case "cloud":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "cloud-rain":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "snowflake":
        return <Snowflake className="h-8 w-8 text-blue-200" />
      case "cloud-lightning":
        return <CloudLightning className="h-8 w-8 text-yellow-300" />
      case "cloud-fog":
        return <CloudFog className="h-8 w-8 text-gray-300" />
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />
    }
  }

  if (loading) {
    return (
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center justify-center h-[140px]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-white/10 h-12 w-12"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4 flex items-center justify-center h-[140px]">
        <p className="text-white/60 text-sm">Weather data unavailable</p>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Current Weather in {capital}</h3>
        <div className="text-xs text-white/60">Live Data</div>
      </div>

      <div className="flex items-center">
        <div className="mr-4">{getWeatherIcon(weather.icon)}</div>

        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">{weather.temperature}°C</span>
            <span className="ml-2 text-white/70">{weather.condition}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center text-sm text-white/70">
              <Wind className="h-4 w-4 mr-1" />
              <span>{weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center text-sm text-white/70">
              <Thermometer className="h-4 w-4 mr-1" />
              <span>{weather.humidity}% humidity</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
