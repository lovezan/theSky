"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Globe, Users, MapPin } from "lucide-react"
import type { Country } from "@/lib/api"

interface CountryCardProps {
  country: Country
  index: number
}

export function CountryCard({ country, index }: CountryCardProps) {
  return (
    <motion.div
      className="relative group overflow-hidden rounded-lg h-[280px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
      whileHover={{ y: -5 }}
    >
      {/* Card background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black z-10"></div>

      {/* Flag background */}
      <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity duration-500">
        <img
          src={country.flags.png || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-cover filter blur-[2px] group-hover:blur-[1px] transition-all duration-500"
        />
      </div>

      {/* Futuristic border effect */}
      <div className="absolute inset-0 border border-white/10 z-20 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 p-6 h-full flex flex-col">
        <div className="flex-1">
          {/* Flag in corner */}
          <div className="absolute top-4 right-4 w-12 h-8 overflow-hidden rounded border border-white/20 shadow-lg">
            <img
              src={country.flags.png || "/placeholder.svg"}
              alt={`Flag of ${country.name}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Country name */}
          <h3 className="text-xl font-bold text-white mb-4 pr-14">{country.name}</h3>

          {/* Country details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-white/70">
              <MapPin className="h-4 w-4 mr-2 text-white/50" />
              <span>{country.capital || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm text-white/70">
              <Globe className="h-4 w-4 mr-2 text-white/50" />
              <span>{country.region}</span>
            </div>
            <div className="flex items-center text-sm text-white/70">
              <Users className="h-4 w-4 mr-2 text-white/50" />
              <span>{country.population.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/blogs/${country.alpha3Code}`}
          className="w-full py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md font-medium text-white flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-white/20 group"
        >
          <span>View Guide</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}
