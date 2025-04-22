"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, Bot, User, ImageIcon, Loader2, Maximize2, Minimize2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIChatInterface() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi there! I'm your AI assistant powered by DeepSeek. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call DeepSeek API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Chat Interface",
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
              content: input
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
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setImagePreview(null)
      setSelectedImage(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file.name)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Bot className="h-5 w-5 mr-2" />
          <span className="font-medium">AI Assistant</span>
        </motion.button>
      )}

      {/* Chat interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 left-6 z-50"
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
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">AI Assistant</h3>
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
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-white/90"
                          }`}
                        >
                          <div className="flex items-start mb-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                message.role === "user" ? "bg-blue-700" : "bg-blue-600"
                              }`}
                            >
                              {message.role === "user" ? (
                                <User className="h-3 w-3 text-white" />
                              ) : (
                                <Bot className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="text-xs opacity-70">{message.role === "user" ? "You" : "AI"}</div>
                          </div>
                          <p className="whitespace-pre-line">{message.content}</p>
                          <div className="text-right text-xs opacity-50 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-white/10 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                            <span className="text-white/70 text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors mr-2"
                        title="Upload image"
                      >
                        <ImageIcon className="h-5 w-5" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type your message..."
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-white"
                          disabled={isLoading}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={isLoading || !input.trim()}
                          className="absolute right-1 top-1 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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