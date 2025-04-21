"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import FooterMinimal from "@/components/footer-minimal"
import LoadingAnimation from "@/components/loading-animation"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
    const hasVisited = sessionStorage.getItem("hasVisitedBefore")

    if (!hasVisited) {
      setLoading(true)
      sessionStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  useEffect(() => {
    if (mounted && !authLoading && !user) {
      const isAuthPage = pathname === "/login" || pathname === "/signup"
      if (!isAuthPage) {
        router.push("/login")
      }
    }
  }, [user, authLoading, mounted, pathname, router])

  if (!mounted) {
    return null
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup"

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {loading && <LoadingAnimation onComplete={() => setLoading(false)} />}
        <div className={loading ? "hidden" : ""}>
          {!isAuthPage && <Navbar />}
          {children}
          {!isAuthPage && <FooterMinimal />}
        </div>
      </ThemeProvider>
    </>
  )
}
