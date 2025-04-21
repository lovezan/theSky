"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, User, Clock, Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import { fetchCountries, type Country, generateBlogExcerpt, generateCategory } from "@/lib/api"
import { useRouter } from "next/navigation"

export function Blogs() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Categories based on regions
  const categories = [
    { id: "all", name: "All Regions" },
    { id: "europe", name: "Europe" },
    { id: "asia", name: "Asia" },
    { id: "africa", name: "Africa" },
    { id: "americas", name: "Americas" },
    { id: "oceania", name: "Oceania" },
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
          // Limit to 20 countries for better performance
          setCountries(data.slice(0, 20))
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

  // Transform countries into blog posts
  const blogPosts = countries.map((country, index) => ({
    id: country.alpha3Code,
    title: `Exploring ${country.name}: A Complete Travel Guide`,
    excerpt: generateBlogExcerpt(country),
    category: generateCategory(country),
    author: "Travel Team",
    date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
    image: country.flags.png,
    featured: index === 0, // Make the first country the featured post
    country: country, // Store the original country data
  }))

  // Filter posts based on search query and active category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.country.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === "all" || post.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // Get featured post
  const featuredPost = blogPosts.find((post) => post.featured)

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // If we have a direct match with a country name, navigate to that country's page
      const matchedCountry = countries.find((country) => country.name.toLowerCase() === searchQuery.toLowerCase())

      if (matchedCountry) {
        router.push(`/blogs/${matchedCountry.alpha3Code}`)
      } else {
        // Otherwise just filter the current view
        // The filtering is already handled by the filteredPosts variable
      }
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 flex items-center justify-center">
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
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400">
              Latest Travel Guides
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover fascinating countries, cultures, and travel destinations from around the world.
          </p>
        </motion.div>

        {/* Search and Categories */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Search Bar */}
            <motion.form
              className="relative w-full md:w-96"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onSubmit={handleSearch}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
                placeholder="Search countries or articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="sr-only">
                Search
              </button>
            </motion.form>

            {/* Categories */}
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && activeCategory === "all" && searchQuery === "" && (
          <motion.div
            className="max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
              <img
                src={featuredPost.image || "/placeholder.svg?height=500&width=1200"}
                alt={featuredPost.title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-primary/80 rounded-full text-xs font-medium text-primary-foreground">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-background/80 rounded-full text-xs font-medium text-muted-foreground">
                    {categories.find((c) => c.id === featuredPost.category)?.name || featuredPost.category}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{featuredPost.title}</h2>
                <p className="text-lg text-gray-300 mb-6 max-w-3xl">{featuredPost.excerpt}</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{featuredPost.readTime}</span>
                  </div>
                </div>
                <Link
                  href={`/blogs/${featuredPost.id}`}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                  <span>Read Article</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} categories={categories} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

function BlogCard({ post, index, categories }) {
  return (
    <motion.div
      className="relative group overflow-hidden rounded-xl h-[380px] border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
    >
      {/* Card background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black z-10"></div>

      {/* Flag background */}
      <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500">
        <img
          src={post.image || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-cover filter blur-[1px] group-hover:blur-0 transition-all duration-500"
        />
      </div>

      {/* Futuristic border effect */}
      <div className="absolute inset-0 border border-white/10 z-20 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-30 p-6 h-full flex flex-col">
        <div className="flex-1">
          {/* Category badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              {categories.find((c) => c.id === post.category)?.name || post.category}
            </span>
          </div>

          {/* Post title */}
          <h3 className="text-xl font-bold text-white mb-3 mt-8 line-clamp-2">{post.title}</h3>

          {/* Post excerpt */}
          <p className="text-white/70 mb-4 line-clamp-3">{post.excerpt}</p>

          {/* Post meta */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2 text-white/60">
              <User className="h-4 w-4" />
              <span className="text-xs">{post.author}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60">
              <Clock className="h-4 w-4" />
              <span className="text-xs">{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/blogs/${post.id}`}
          className="w-full py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md font-medium text-white flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-white/20 group"
        >
          <span>Read More</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}
