"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Volume2, Copy, Check } from "lucide-react"

interface AIResponseProps {
  response: string
  isOpen: boolean
  onClose: () => void
}

export default function AIResponse({ response, isOpen, onClose }: AIResponseProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [copied, setCopied] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      speechRef.current = new SpeechSynthesisUtterance()
      speechRef.current.rate = 1
      speechRef.current.pitch = 1
      speechRef.current.volume = 1

      // Try to find a female voice
      const voices = window.speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Google UK English Female"),
      )

      if (femaleVoice) {
        speechRef.current.voice = femaleVoice
      }

      speechRef.current.onend = () => {
        setIsSpeaking(false)
      }
    }

    return () => {
      if (speechRef.current && isSpeaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeaking])

  // Update speech text when response changes
  useEffect(() => {
    if (speechRef.current) {
      speechRef.current.text = response
    }
  }, [response])

  const speakResponse = () => {
    if (speechRef.current) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        window.speechSynthesis.speak(speechRef.current)
        setIsSpeaking(true)
      }
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black/80 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Sky Assistant</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4 max-h-[300px] overflow-y-auto">
              <p className="text-white/90 whitespace-pre-line">{response}</p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={speakResponse}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  isSpeaking
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                } transition-colors`}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                {isSpeaking ? "Stop Speaking" : "Speak Response"}
              </button>

              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-2 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
