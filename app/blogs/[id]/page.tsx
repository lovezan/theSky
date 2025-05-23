"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Calendar,
  User,
  Clock,
  MessageCircle,
  Heart,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ArrowLeft,
} from "lucide-react"
import { fetchCountryByCode, type Country, generateBlogContent, generateCategory } from "@/lib/api"
import WeatherWidget from "@/components/weather-widget"
import CurrencyConverter from "@/components/currency-converter"
import LanguageTranslator from "@/components/language-translator"
import TravelPlanner from "@/components/travel-planner"
import SocialSharing from "@/components/social-sharing"

// Add this function at the top of the file, after the imports
const getStoredComments = (countryId: string) => {
  if (typeof window === "undefined") return null

  try {
    const storedComments = localStorage.getItem(`comments_${countryId}`)
    return storedComments ? JSON.parse(storedComments) : null
  } catch (error) {
    console.error("Error getting stored comments:", error)
    return null
  }
}

const saveComments = (countryId: string, comments: any[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(`comments_${countryId}`, JSON.stringify(comments))
  } catch (error) {
    console.error("Error saving comments:", error)
  }
}

export default function BlogPost() {
  const params = useParams()
  const id = params?.id as string

  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Asma Naaz",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      date: "2 days ago",
      content:
        "This country has been on my bucket list for years! The article really captures the essence of what makes it special. Can't wait to visit someday.",
    },
    {
      id: 2,
      author: "Talib Hassan",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      date: "5 days ago",
      content:
        "Great insights! I visited last summer and can confirm that the local cuisine is absolutely amazing. Don't miss trying the traditional dishes mentioned in the article.",
    },
  ])

  useEffect(() => {
    if (id) {
      const storedComments = getStoredComments(id)
      if (storedComments) {
        setComments(storedComments)
      }
    }
  }, [id])

  // Fetch country data
  useEffect(() => {
    const getCountry = async () => {
      try {
        setLoading(true)
        const data = await fetchCountryByCode(id)
        if (data) {
          setCountry(data)
        } else {
          setError("Country not found")
        }
        setLoading(false)
      } catch (err) {
        console.error("Error in component:", err)
        setError("Failed to fetch country data. Please try again later.")
        setLoading(false)
      }
    }

    if (id) {
      getCountry()
    }
  }, [id])

  // Handle share functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const comment = form.comment.value

    if (name && comment) {
      const newComment = {
        id: comments.length + 1,
        author: name,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "women" : "men"}/${Math.floor(Math.random() * 100)}.jpg`,
        date: "Just now",
        content: comment,
      }

      const updatedComments = [newComment, ...comments]
      setComments(updatedComments)

      // Save comments to localStorage
      if (id) {
        saveComments(id, updatedComments)
      }

      form.reset()
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !country) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-black">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Country not found</h1>
          <p className="text-gray-300 mb-8">The country you're looking for doesn't exist or couldn't be loaded.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Create blog post from country data
  const post = {
    id: country.alpha3Code,
    title: `Exploring ${country.name}: A Complete Travel Guide`,
    content: generateBlogContent(country),
    category: generateCategory(country),
    author: "Travel Team",
    authorTitle: "Travel Expert",
    authorBio: `Our travel team specializes in creating comprehensive guides to destinations around the world. With years of experience exploring ${country.region}, they provide authentic insights and practical tips for travelers.`,
    authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: `${Math.floor(Math.random() * 10) + 5} min read`,
    image: country.flags.png,
    tags: [country.region, country.subregion, "Travel Guide", "Culture", "Tourism"],
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back to blogs link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Back to all countries</span>
          </Link>
        </div>

        {/* Featured Image with parallax effect */}
        <motion.div
          className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>

          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <img
              src={country.flags.png || "/placeholder.svg?height=500&width=1200"}
              alt={`Flag of ${country.name}`}
              className="w-full h-full object-contain bg-gray-900"
            />
          </motion.div>

          {/* Category badge */}
          <div className="absolute top-6 left-6 z-20">
            <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {post.title}
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center text-gray-300 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs navigation */}
        <div className="mb-8 border-b border-gray-800">
          <div className="flex overflow-x-auto scrollbar-hide space-x-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "overview" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("travel-tools")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "travel-tools"
                  ? "text-white border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Travel Tools
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "planner" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-white"
              }`}
            >
              Trip Planner
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "comments" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-white"
              }`}
            >
              Comments ({comments.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Social sharing */}
                <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-800">
                  <button
                    className="p-2 bg-blue-600/20 text-blue-400 rounded-full hover:bg-blue-600/30 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 bg-cyan-600/20 text-cyan-400 rounded-full hover:bg-cyan-600/30 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 bg-blue-700/20 text-blue-400 rounded-full hover:bg-blue-700/30 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 bg-gray-700/50 text-gray-400 rounded-full hover:bg-gray-700 transition-colors"
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>

                {/* Article content */}
                <div
                  className="prose prose-invert prose-lg max-w-none mb-12"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Article actions */}
                <div className="flex items-center justify-between py-6 border-t border-b border-gray-800 mb-12">
                  <div className="flex items-center space-x-6">
                    <button
                      className={`flex items-center space-x-2 ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"} transition-colors`}
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                      <span>{liked ? "Liked" : "Like"}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("comments")}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Comments ({comments.length})</span>
                    </button>
                  </div>
                  <button
                    className={`flex items-center space-x-2 ${bookmarked ? "text-purple-500" : "text-gray-400 hover:text-purple-500"} transition-colors`}
                    onClick={() => setBookmarked(!bookmarked)}
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
                    <span>{bookmarked ? "Saved" : "Save"}</span>
                  </button>
                </div>

                {/* Author bio */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-12">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img
                      src={post.authorAvatar || "/placeholder.svg?height=80&width=80"}
                      alt={post.author}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{post.author}</h3>
                      <p className="text-purple-400 mb-3">{post.authorTitle}</p>
                      <p className="text-gray-300">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "travel-tools" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Travel Tools for {country.name}</h2>

                {/* Weather widget */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Weather Information</h3>
                  <WeatherWidget
                    countryName={country.name}
                    capital={country.capital}
                    lat={country.latlng[0]}
                    lng={country.latlng[1]}
                  />
                </div>

                {/* Currency converter */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Currency Converter</h3>
                  <CurrencyConverter countryCurrency={country.currencies?.[0]} />
                </div>

                {/* Language translator */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Language Translator</h3>
                  <LanguageTranslator countryLanguages={country.languages} />
                </div>

                {/* Social sharing */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-white">Share This Guide</h3>
                  <SocialSharing
                    title={`Travel Guide to ${country.name}`}
                    url={window.location.href}
                    description={`Discover everything you need to know about traveling to ${country.name} with our comprehensive guide.`}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "planner" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-2xl font-bold text-white mb-6">Plan Your Trip to {country.name}</h2>
                <TravelPlanner countryName={country.name} capital={country.capital} />
              </motion.div>
            )}

            {activeTab === "comments" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                id="comments"
                className="scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h2>

                {/* Comment form */}
                <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 mb-8">
                  <h4 className="text-lg font-medium text-white mb-4">Leave a comment</h4>
                  <form className="space-y-4" onSubmit={handleCommentSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-400 mb-1">
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white resize-none"
                        placeholder="Share your thoughts..."
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>

                {/* Comments list */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      className="bg-gray-900/30 border border-gray-800 rounded-xl p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={comment.avatar || "/placeholder.svg"}
                          alt={comment.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-white">{comment.author}</h5>
                            <span className="text-sm text-gray-400">{comment.date}</span>
                          </div>
                          <p className="text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Country Quick Facts */}
              <motion.div
                className="bg-gray-900/30 border border-gray-800 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-white mb-6">Country Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capital:</span>
                    <span className="text-white font-medium">{country.capital}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Region:</span>
                    <span className="text-white font-medium">{country.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Population:</span>
                    <span className="text-white font-medium">{country.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Area:</span>
                    <span className="text-white font-medium">{country.area?.toLocaleString() || "N/A"} km²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Languages:</span>
                    <span className="text-white font-medium">{country.languages.map((l) => l.name).join(", ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Currency:</span>
                    <span className="text-white font-medium">
                      {country.currencies?.map((c) => `${c.name} (${c.symbol})`).join(", ") || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calling Code:</span>
                    <span className="text-white font-medium">+{country.callingCodes[0]}</span>
                  </div>
                </div>
              </motion.div>

              {/* Neighboring Countries */}
              {country.borders && country.borders.length > 0 && (
                <motion.div
                  className="bg-gray-900/30 border border-gray-800 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Neighboring Countries</h3>
                  <div className="space-y-3">
                    {country.borders.map((border, index) => (
                      <Link
                        key={index}
                        href={`/blogs/${border}`}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="w-8 h-6 mr-3 overflow-hidden rounded border border-gray-700 flex-shrink-0">
                          <img
                            src={`https://flagcdn.com/w80/${border.toLowerCase().substring(0, 2)}.png`}
                            alt={`Flag of ${border}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-gray-300 hover:text-white transition-colors">{border}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Weather Widget */}
              <WeatherWidget
                countryName={country.name}
                capital={country.capital}
                lat={country.latlng[0]}
                lng={country.latlng[1]}
              />

              {/* Tags cloud */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  className="bg-gray-900/30 border border-gray-800 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/?tag=${tag}`}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                    <Link
                      href="/"
                      className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded-full text-sm text-purple-300 hover:text-white transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Newsletter signup */}
              <motion.div
                className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-xl font-bold text-white mb-3">Subscribe to Our Newsletter</h3>
                <p className="text-gray-300 mb-4">
                  Get the latest travel guides and country insights delivered to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white"
                    placeholder="Your email address"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    Subscribe
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
