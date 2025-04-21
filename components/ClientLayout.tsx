"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface ClientLayoutProps {
  children: ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { user, authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // When mounting, set the mounted state to true
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration error
  if (!mounted) {
    return <>{children}</>
  }

  useEffect(() => {
    if (mounted && !authLoading) {
      const isAuthPage = pathname === "/login" || pathname === "/signup"

      if (!user && !isAuthPage) {
        router.push("/login")
      } else if (user && isAuthPage) {
        // If user is already logged in and tries to access login/signup page, redirect to home
        router.push("/")
      }
    }
  }, [user, authLoading, mounted, pathname, router])

  return <>{children}</>
}

export default ClientLayout
