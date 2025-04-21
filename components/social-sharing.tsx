"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Mail, Link2, Check, Heart } from "lucide-react"

interface SocialSharingProps {
  title: string
  url: string
  description?: string
}

export default function SocialSharing({ title, url, description }: SocialSharingProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 5)

  // Encode for sharing
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedDescription = encodeURIComponent(description || "")

  // Share URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle like
  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Share this guide</h3>
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-white/70 hover:text-white transition-colors"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          <span>{likeCount}</span>
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg text-blue-400 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-5 w-5 mb-1" />
          <span className="text-xs">Facebook</span>
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-cyan-600/20 hover:bg-cyan-600/30 rounded-lg text-cyan-400 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-5 w-5 mb-1" />
          <span className="text-xs">Twitter</span>
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-blue-700/20 hover:bg-blue-700/30 rounded-lg text-blue-400 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-5 w-5 mb-1" />
          <span className="text-xs">LinkedIn</span>
        </a>

        <a
          href={mailUrl}
          className="flex flex-col items-center justify-center p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-purple-400 transition-colors"
          aria-label="Share via Email"
        >
          <Mail className="h-5 w-5 mb-1" />
          <span className="text-xs">Email</span>
        </a>

        <button
          onClick={copyLink}
          className="flex flex-col items-center justify-center p-3 bg-gray-600/20 hover:bg-gray-600/30 rounded-lg text-gray-400 transition-colors"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="h-5 w-5 mb-1 text-green-500" />
              <span className="text-xs text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Link2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-white/50 text-xs">Help others discover this amazing destination!</p>
      </div>
    </motion.div>
  )
}
