"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import AdvancedGlobe from "@/components/advanced-globe"
import { fetchCountries } from "@/lib/api"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

export default function EnhancedHero() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchCountries()
        setCountries(data)
      } catch (err) {
        console.error("Error fetching countries:", err)
      } finally {
        setLoading(false)
      }
    }

    getCountries()
  }, [])

  const words = [
    {
      text: "Discover",
    },
    {
      text: "the",
    },
    {
      text: "World",
    },
    {
      text: "with",
    },
    {
      text: "theskytrails",
      className: "text-purple-500 dark:text-purple-400",
    },
  ]

  return (
    <section className="relative min-h-screen pt-16 flex items-center overflow-hidden bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern-dark dark:bg-grid-pattern-dark opacity-[0.05]" />
      </div>

      {/* Star decorations */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full filter blur-[120px] animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/2 bg-cyan-500 rounded-full filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="mb-6">
              <TypewriterEffect words={words} className="text-4xl md:text-5xl lg:text-6xl font-bold" />
            </div>

            <motion.p
              className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Your ultimate travel companion for exploring countries and cultures. Our expert guides and insights help
              you plan unforgettable journeys across the globe.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/countries"
                className="group relative px-6 py-3 overflow-hidden rounded-md font-medium transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-700 group-hover:to-blue-700"></div>
                <div className="relative flex items-center justify-center text-white">
                  <span>Explore Countries</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>

              <Link
                href="/about"
                className="px-6 py-3 bg-secondary text-secondary-foreground border border-border rounded-md font-medium hover:bg-secondary/90 transition-all duration-300"
              >
                About Us
              </Link>
            </motion.div>

            {/* Feature badges */}
            <motion.div
              className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20">
                200+ Countries
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Travel Guides
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                Cultural Insights
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <AdvancedGlobe countries={countries} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
