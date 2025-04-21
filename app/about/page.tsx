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
                At Skytrials private limited, we believe that travel transcends merely reaching destinations; it's about
                crafting unforgettable journeys and unveiling the world's wonders. More than a bridge between places, we
                are the architects of cherished memories and the curators of dream adventures. Our heart beats with an
                unquenchable thirst for exploration, and our vision goes beyond the ordinary, turning travel into an
                art—a beautiful dance of dreams meeting reality. While we harness the power of cutting-edge technology,
                our soul thrives on the personal, human touch that transforms trips into remarkable tales. We stand not
                just as facilitators but as partners, celebrating every wanderer, pioneer, and dreamer. Our promise? To
                not only simplify your journey but to elevate every moment of it.
              </p>
              <p>
                At SkyTrails, we offer more than just services; we weave experiences, blending your aspirations with the
                world's wonders. Embark with us, and let's turn each voyage into a story worth telling. Welcome to
                SkyTrails, where your dreams find their wings. The Skytrails is your all-in-one solution for all your
                travel needs as it gives you everything at one place with bunch of options. You can book your hotel,
                flights, bus as per your feasibility. Our app has eye-catching designs and styles that draw in
                customers. There is one new thing in our app that is the Stories page that you will not find anywhere
                else. It is the most interesting thing you will find on our app.
              </p>
              <p>
                You can browse other person’s stories as well as you can upload your travel journey that can be viewed
                by others. In addition, you don't have to worry about your currency exchange because we are here to
                assist you. With our FOREX option, users can effortlessly convert their money. Therefore, as you embark
                on your journey, all you need to do is enjoy the experience while we take care of everything. It's all
                about onboarding your dreams with The Skytrails, ensuring a hassle-free and delightful journey from
                start to finish. Bring your wanderlust out and explore the world with our best holiday packages with an
                option of customization as per your needs and preferences. There is nothing fixed as you can change or
                alter as per your wishes and suitability because this in your app.
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
