"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-border/40 rounded-xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for the latest travel insights and country guides.
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-200"
              placeholder="Your email address"
              required
            />
            <motion.button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
