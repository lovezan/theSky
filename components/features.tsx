"use client"

import { motion } from "framer-motion"
import { Globe, Search, Map, Compass, BookOpen, Zap } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Comprehensive Country Data",
      description: "Access detailed information about countries from all regions of the world.",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Advanced Search",
      description: "Find countries by name, region, language, or other parameters with our powerful search.",
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: "Interactive Maps",
      description: "Visualize countries and their geographical relationships with interactive maps.",
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Travel Guides",
      description: "Get expert travel tips and recommendations for your next international adventure.",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Cultural Insights",
      description: "Learn about diverse cultures, traditions, and histories from around the globe.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Fast Performance",
      description: "Enjoy a seamless browsing experience with our optimized website performance.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400">
              Instant access to country data
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore comprehensive information and travel insights about countries around the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background/50 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
