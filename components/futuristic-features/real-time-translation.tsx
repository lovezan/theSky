"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Languages, ArrowRight, Check, Loader2 } from "lucide-react"

interface RealTimeTranslationProps {
  text?: string
}

export default function RealTimeTranslation({ text = "" }: RealTimeTranslationProps) {
  const [inputText, setInputText] = useState(text)
  const [translatedText, setTranslatedText] = useState("")
  const [fromLanguage, setFromLanguage] = useState("en")
  const [toLanguage, setToLanguage] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [translationComplete, setTranslationComplete] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "ru", name: "Russian" },
    { code: "pt", name: "Portuguese" },
    { code: "hi", name: "Hindi" },
  ]

  useEffect(() => {
    if (text) setInputText(text)
  }, [text])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (autoTranslate && inputText.trim()) {
      timeout = setTimeout(() => translateText(), 1000)
    }
    return () => clearTimeout(timeout)
  }, [inputText, autoTranslate, fromLanguage, toLanguage])

  const translateText = async () => {
    if (!inputText.trim()) {
      setTranslatedText("")
      return
    }

    setIsTranslating(true)
    setTranslationComplete(false)

    try {
      const fromLangName = languages.find((l) => l.code === fromLanguage)?.name || "English"
      const toLangName = languages.find((l) => l.code === toLanguage)?.name || "Spanish"

      const prompt = `Translate this text from ${fromLangName} to ${toLangName} without explanations: "${inputText}"`

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "RealTime Translator",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3-0324:free",
          messages: [{ role: "user", content: prompt }],
        }),
      })

      const data = await res.json()
      const raw = data?.choices?.[0]?.message?.content || ""

      const cleaned = raw
        .replace(/^["']|["']$/g, "")
        .replace(/^Translation:\s*/i, "")

      setTranslatedText(cleaned)
      setTranslationComplete(true)

      setTimeout(() => setTranslationComplete(false), 2000)
    } catch (err) {
      console.error("Translation error", err)
      setTranslatedText("Translation error. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage)
    setInputText(translatedText)
    setTranslatedText(inputText)
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-full max-w-2xl mx-auto mt-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4 space-x-2">
        <Languages className="text-white/70 h-5 w-5" />
        <h2 className="text-white font-bold text-lg">Real-Time Translation</h2>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <select
          value={fromLanguage}
          onChange={(e) => setFromLanguage(e.target.value)}
          className="bg-white/10 text-white p-2 rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button
          onClick={swapLanguages}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <select
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
          className="bg-white/10 text-white p-2 rounded-md"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate..."
        className="w-full bg-white/5 text-white p-3 rounded-lg mb-4 resize-none h-24 focus:outline-none"
      />

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center text-sm text-white/70 space-x-2">
          <input
            type="checkbox"
            checked={autoTranslate}
            onChange={() => setAutoTranslate((val) => !val)}
          />
          <span>Auto-translate</span>
        </label>

        <button
          onClick={translateText}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
          disabled={isTranslating}
        >
          {isTranslating ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            "Translate"
          )}
        </button>
      </div>

      {translatedText && (
        <motion.div
          className="bg-white/10 p-4 rounded-lg text-white relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {translatedText}
          {translationComplete && (
            <Check className="absolute top-2 right-2 text-green-400 w-4 h-4" />
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
