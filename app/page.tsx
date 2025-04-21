import { Blogs } from "@/components/blogs"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Blogs />
      <Features />
      <Newsletter />
    </main>
  )
}
