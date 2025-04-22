"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, X } from "lucide-react"

interface VoiceRecognitionProps {
  onResult: (transcript: string) => void
  onListening: (isListening: boolean) => void
  isOpen: boolean
  onClose: () => void
}

export default function VoiceRecognition({ onResult, onListening, isOpen, onClose }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = true
          recognitionRef.current.interimResults = true
          recognitionRef.current.lang = "en-US"

          recognitionRef.current.onstart = () => {
            setIsListening(true)
            onListening(true)
          }

          recognitionRef.current.onend = () => {
            setIsListening(false)
            onListening(false)
          }

          recognitionRef.current.onresult = (event: any) => {
            if (!event.results || event.results.length === 0) return

            const current = event.resultIndex
            const result = event.results[current]
            if (!result || result.length === 0) return

            const transcriptText = result[0].transcript || ""
            setTranscript(transcriptText)

            if (result.isFinal) {
              // Check if the wake word is detected
              const lowerTranscript = transcriptText.toLowerCase()
              if (
                lowerTranscript.includes("hey sky") ||
                lowerTranscript.includes("hay sky") ||
                lowerTranscript.includes("hi sky")
              ) {
                // Extract the query after the wake word
                const query = lowerTranscript.replace(/hey sky|hay sky|hi sky/i, "").trim()

                if (query) {
                  onResult(query)
                }
              }
            }
          }

          recognitionRef.current.onerror = (event: any) => {
            console.error("Speech recognition error:", event)
            setError(`Error occurred in recognition: ${event.error || "Unknown error"}`)
            setIsListening(false)
            onListening(false)
          }
        } catch (error) {
          console.error("Error initializing speech recognition:", error)
          setError("Failed to initialize speech recognition")
        }
      } else {
        setError("Speech recognition not supported in this browser")
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          console.error("Error stopping recognition:", error)
        }
      }
    }
  }, [onResult, onListening])

  useEffect(() => {
    if (isOpen && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    } else if (!isOpen && recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isOpen, isListening])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setTranscript("")
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-black/80 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Voice Assistant</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 text-white">{error}</div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                  isListening ? "bg-purple-600/30 animate-pulse" : "bg-white/10"
                }`}
              >
                <button
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isListening
                      ? "bg-purple-600 text-white"
                      : "bg-white/20 text-white/70 hover:bg-white/30 hover:text-white"
                  } transition-all duration-300`}
                >
                  {isListening ? <Mic className="h-8 w-8" /> : <MicOff className="h-8 w-8" />}
                </button>
              </div>

              <div className="text-center">
                <p className="text-white/70 mb-2">{isListening ? "Listening..." : "Click the microphone to start"}</p>
                <p className="text-sm text-white/50">Say "Hey Sky" followed by your question</p>
              </div>
            </div>

            {transcript && (
              <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-white/90">{transcript}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
