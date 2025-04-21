import Link from "next/link"
import { Globe } from "lucide-react"

export default function FooterMinimal() {
  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-white/80" />
            <span className="text-lg font-medium text-white">theskytrails</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/countries" className="text-sm text-white/70 hover:text-white transition-colors">
              Countries
            </Link>
            <Link href="/about" className="text-sm text-white/70 hover:text-white transition-colors">
              About
            </Link>
          </div>

          <div className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} theskytrails. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
