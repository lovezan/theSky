"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9"></div> // Placeholder to prevent layout shift
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-full p-2 transition-colors hover:bg-secondary flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? (
        <Sun className="h-5 w-5 text-foreground/80" />
      ) : (
        <Moon className="h-5 w-5 text-foreground/80" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
