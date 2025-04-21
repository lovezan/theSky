"use client"

import { motion } from "framer-motion"
import Globe from "@/components/globe"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
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

      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Discover the World</span>
              <br />
              <span className="text-foreground">with theskytrails</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Your ultimate travel companion for exploring countries and cultures. Our expert guides and insights help
              you plan unforgettable journeys across the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/countries"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
              >
                <span>Explore Countries</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-secondary text-secondary-foreground border border-border rounded-md font-medium hover:bg-secondary/90 transition-all duration-300"
              >
                About Us
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <Globe />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
