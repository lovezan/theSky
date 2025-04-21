"use client"

import type React from "react"

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import FooterMinimal from "@/components/footer-minimal"
import LoadingAnimation from "@/components/loading-animation"
import { useState, useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Update the useState and useEffect for loading animation
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if this is the first visit in this session
    const hasVisited = sessionStorage.getItem("hasVisitedBefore")

    if (!hasVisited) {
      // First visit - show animation
      setLoading(true)
      // Set the flag in sessionStorage
      sessionStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>theskytrails - Travel Guides & Country Explorer</title>
        <meta name="description" content="Discover the world through our travel blog powered by country data" />
      </head>
      <body className={`${inter.className} bg-black scrollbar-hide`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          {loading && <LoadingAnimation onComplete={() => setLoading(false)} />}
          <div className={loading ? "hidden" : ""}>
            <Navbar />
            {children}
            <FooterMinimal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
