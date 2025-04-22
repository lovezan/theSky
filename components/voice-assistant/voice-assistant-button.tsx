"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Loader2, X, Maximize2, Minimize2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function VoiceAssistantButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleVoiceResult = async (transcript: string) => {
    if (!transcript.trim()) return

    const userMessage: Message = {
      role: "user",
      content: transcript,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessing(true)

    try {
      // Call OpenRouter API (similar to your first component)
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Voice Assistant",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: transcript
            }
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const assistantResponse = data.choices[0].message.content

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing voice query:", error)

      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const startListening = () => {
    setIsListening(true)
    // In a real implementation, you would start the voice recognition here
    // For example: speechRecognition.start()
  }

  const stopListening = () => {
    setIsListening(false)
    // In a real implementation, you would stop the voice recognition here
    // For example: speechRecognition.stop()
  }

  return (
    <>
      {/* Voice Assistant button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          aria-label="Voice Assistant"
        >
          <Mic className="h-6 w-6" />
        </motion.button>
      )}

      {/* Voice Assistant interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className={`bg-black/80 border border-white/20 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                isMinimized ? "w-64 h-16" : "w-80 sm:w-96 h-[500px]"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">Voice Assistant</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMinimize}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="p-4 h-[380px] overflow-y-auto scrollbar-hide">
                    {messages.length === 0 && (
                      <div className="h-full flex items-center justify-center text-white/70 text-center p-4">
                        <div>
                          <p className="text-lg font-medium mb-2">Voice Assistant</p>
                          <p className="text-sm">Click the microphone button to start speaking</p>
                        </div>
                      </div>
                    )}

                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-purple-600 text-white" : "bg-white/10 text-white/90"
                          }`}
                        >
                          <div className="flex items-start mb-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                message.role === "user" ? "bg-purple-700" : "bg-purple-600"
                              }`}
                            >
                              {message.role === "user" ? (
                                <Mic className="h-3 w-3 text-white" />
                              ) : (
                                <Mic className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="text-xs opacity-70">{message.role === "user" ? "You" : "Assistant"}</div>
                          </div>
                          <p className="whitespace-pre-line">{message.content}</p>
                          <div className="text-right text-xs opacity-50 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                              <Mic className="h-3 w-3 text-white" />
                            </div>
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                            <span className="text-white/70 text-sm">Processing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Voice input */}
                  <div className="p-4 border-t border-white/10 flex justify-center">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={isProcessing}
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isListening ? "bg-purple-600 animate-pulse" : "bg-gradient-to-r from-purple-600 to-blue-600"
                      } text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 disabled:opacity-50`}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
