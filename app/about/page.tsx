"use client"

import { motion } from "framer-motion"
import { Award, Heart, Compass } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Section */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About theskytrails</h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            We're passionate about connecting travelers with authentic experiences and comprehensive information about
            countries around the world.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-white/70">
              <p>
                Founded in 2023, theskytrails began with a simple mission: to provide travelers with reliable,
                comprehensive information about countries around the world. We believe that informed travelers make
                better decisions, have richer experiences, and develop deeper connections with the places they visit.
              </p>
              <p>
                Our team of passionate travelers and content creators works tirelessly to bring you accurate
                information, insightful guides, and inspiring stories from every corner of the globe. We combine
                data-driven research with personal experiences to create content that is both informative and engaging.
              </p>
              <p>
                Whether you're planning your next adventure, researching a destination, or simply exploring the world
                from home, theskytrails is your trusted companion for global discovery.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Our Values */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
              <div className="text-purple-400 mb-4">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Authenticity</h3>
              <p className="text-white/70">
                We believe in presenting countries and cultures as they truly are, celebrating their uniqueness without
                stereotypes or generalizations.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
              <div className="text-cyan-400 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Accuracy</h3>
              <p className="text-white/70">
                We are committed to providing reliable, up-to-date information that travelers can trust when making
                decisions.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
              <div className="text-pink-400 mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Passion</h3>
              <p className="text-white/70">
                Our love for travel and cultural exchange drives everything we do, from research to content creation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-purple-500/30">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Sarah Johnson</h3>
              <p className="text-purple-400 mb-3">Founder & CEO</p>
              <p className="text-white/70 text-sm">
                Travel enthusiast with over 50 countries visited. Former travel journalist with a passion for cultural
                immersion.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-cyan-500/30">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="David Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">David Chen</h3>
              <p className="text-cyan-400 mb-3">Head of Content</p>
              <p className="text-white/70 text-sm">
                Geography expert and travel writer with a background in international relations and cultural studies.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-pink-500/30">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Maya Patel"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Maya Patel</h3>
              <p className="text-pink-400 mb-3">Lead Researcher</p>
              <p className="text-white/70 text-sm">
                Data analyst and cultural researcher who ensures our country information is accurate and comprehensive.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you!
            </p>
            <Link
              href="mailto:contact@theskytrails.com"
              className="inline-flex items-center px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-white/90 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
