"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CuboidIcon as Cube, X } from "lucide-react"

export default function ARViewButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
      >
        <Cube className="h-5 w-5" />
        <span>AR View</span>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black/80 border border-white/20 rounded-2xl p-6 max-w-lg w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">AR Experience</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-gradient-to-b from-cyan-900/30 to-blue-900/30 rounded-lg p-8 text-center">
                <Cube className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-white mb-2">AR Feature Coming Soon</h4>
                <p className="text-white/70 mb-4">
                  Our augmented reality experience is currently in development. Soon you'll be able to explore countries
                  in immersive 3D right from your device!
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
