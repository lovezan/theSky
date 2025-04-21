"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Globe, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import UserDropdown from "@/components/auth/user-dropdown"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/countries?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-foreground" />
            <span className="text-xl font-bold text-foreground">theskytrails</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/countries"
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium"
            >
              Countries
            </Link>
            <Link
              href="/about"
              className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium"
            >
              About
            </Link>
            <div className="flex items-center space-x-4 pl-4 border-l border-border">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-40 py-1.5 pl-3 pr-8 rounded-md text-sm bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-foreground"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <UserDropdown />
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <UserDropdown />
            </div>
            <button
              className="text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/countries"
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Countries
              </Link>
              <Link
                href="/about"
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <form onSubmit={handleSearch} className="pt-2 relative">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 rounded-md text-sm bg-secondary border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-foreground"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-muted-foreground"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
