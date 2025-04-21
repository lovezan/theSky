import Link from "next/link"
import { Globe, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">theskytrails</span>
            </div>
            <p className="text-white/70 mb-4">
              Discover the world through our travel blog powered by real country data. Explore cultures, landmarks, and
              travel tips from around the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/countries" className="text-white/70 hover:text-white transition-colors">
                  Countries
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/destinations" className="text-white/70 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/category/culture" className="text-white/70 hover:text-white transition-colors">
                  Culture & History
                </Link>
              </li>
              <li>
                <Link href="/category/tips" className="text-white/70 hover:text-white transition-colors">
                  Travel Tips
                </Link>
              </li>
              <li>
                <Link href="/category/food" className="text-white/70 hover:text-white transition-colors">
                  Food & Cuisine
                </Link>
              </li>
              <li>
                <Link href="/category/adventure" className="text-white/70 hover:text-white transition-colors">
                  Adventure Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-white/50 mt-0.5" />
                <span className="text-white/70">123 Travel Street, Global City, World</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-white/50" />
                <span className="text-white/70">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-white/50" />
                <a href="mailto:info@theskytrails.com" className="text-white/70 hover:text-white transition-colors">
                  info@theskytrails.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/50">
          <p>&copy; {new Date().getFullYear()} theskytrails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
