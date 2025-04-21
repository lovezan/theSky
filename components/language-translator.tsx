"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Languages, Copy, Check, Volume2 } from "lucide-react"

interface LanguageTranslatorProps {
  countryLanguages?: {
    name: string
    nativeName: string
  }[]
}

interface Language {
  code: string
  name: string
}

export default function LanguageTranslator({ countryLanguages }: LanguageTranslatorProps) {
  const [text, setText] = useState<string>("")
  const [fromLang, setFromLang] = useState<string>("en")
  const [toLang, setToLang] = useState<string>("")
  const [translation, setTranslation] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [languages, setLanguages] = useState<Language[]>([
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ])

  // Add country languages if they exist
  useEffect(() => {
    if (countryLanguages && countryLanguages.length > 0) {
      // Map country languages to our format and add if not already present
      const newLanguages = countryLanguages.map((lang) => ({
        // Create a simple code from the language name
        code: lang.name.toLowerCase().substring(0, 2),
        name: lang.name,
      }))

      // Filter out duplicates
      const filteredNewLangs = newLanguages.filter((newLang) => !languages.some((lang) => lang.code === newLang.code))

      if (filteredNewLangs.length > 0) {
        setLanguages((prev) => [...prev, ...filteredNewLangs])
      }

      // Set the default "to" language to the first country language if available
      if (countryLanguages[0] && !toLang) {
        setToLang(newLanguages[0].code)
      }
    }
  }, [countryLanguages, languages, toLang])

  // Set default "to" language if not set
  useEffect(() => {
    if (!toLang && languages.length > 0) {
      // Find a language that's not the "from" language
      const defaultToLang = languages.find((lang) => lang.code !== fromLang)
      if (defaultToLang) {
        setToLang(defaultToLang.code)
      }
    }
  }, [fromLang, toLang, languages])

  // Mock translation function
  const translateText = () => {
    if (!text.trim()) {
      setTranslation("")
      return
    }

    setLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate a mock translation
      // In a real app, you would use a translation API like Google Translate
      let result = ""

      // Simple mock translation logic
      if (toLang === "es") {
        result = `${text} (en español)`
      } else if (toLang === "fr") {
        result = `${text} (en français)`
      } else if (toLang === "de") {
        result = `${text} (auf Deutsch)`
      } else if (toLang === "it") {
        result = `${text} (in italiano)`
      } else if (toLang === "pt") {
        result = `${text} (em português)`
      } else if (toLang === "ru") {
        result = `${text} (на русском)`
      } else if (toLang === "ja") {
        result = `${text} (日本語で)`
      } else if (toLang === "zh") {
        result = `${text} (用中文)`
      } else if (toLang === "ar") {
        result = `${text} (بالعربية)`
      } else if (toLang === "hi") {
        result = `${text} (हिंदी में)`
      } else {
        // For any other language
        result = `${text} (translated to ${languages.find((l) => l.code === toLang)?.name || toLang})`
      }

      setTranslation(result)
      setLoading(false)
    }, 1000)
  }

  // Copy translation to clipboard
  const copyTranslation = () => {
    if (translation) {
      navigator.clipboard.writeText(translation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Text-to-speech function
  const speakText = (text: string, lang: string) => {
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang // Set language code
    window.speechSynthesis.speak(utterance)
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Language Translator</h3>
        <Languages className="h-5 w-5 text-white/70" />
      </div>

      <div className="space-y-4">
        {/* Language selectors */}
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <label htmlFor="from-lang" className="block text-sm text-white/70 mb-1">
              From
            </label>
            <select
              id="from-lang"
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white appearance-none"
            >
              {languages.map((language) => (
                <option key={`from-${language.code}`} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="to-lang" className="block text-sm text-white/70 mb-1">
              To
            </label>
            <select
              id="to-lang"
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white appearance-none"
            >
              {languages.map((language) => (
                <option key={`to-${language.code}`} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input text area */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="translate-text" className="block text-sm text-white/70">
              Text to translate
            </label>
            <button
              onClick={() => speakText(text, fromLang)}
              disabled={!text}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors disabled:opacity-50"
              title="Listen"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            id="translate-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white h-20 resize-none"
            placeholder="Enter text to translate..."
          />
        </div>

        {/* Translate button */}
        <button
          onClick={translateText}
          disabled={!text.trim() || loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:hover:bg-purple-600"
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        {/* Translation result */}
        {translation && (
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm text-white/70">Translation</div>
              <div className="flex space-x-1">
                <button
                  onClick={() => speakText(translation, toLang)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Listen"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={copyTranslation}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div className="p-3 bg-black/20 border border-white/10 rounded-lg text-white">{translation}</div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
