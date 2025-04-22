import EnhancedHero from "@/components/enhanced-hero"
import { Blogs } from "@/components/blogs"
import Features from "@/components/features"
import Newsletter from "@/components/newsletter"
import InteractiveMap from "@/components/interactive-map"
import UserProfile from "@/components/user-profile"
import ARViewButton from "@/components/futuristic-features/ar-view-button"
import RealTimeTranslation from "@/components/futuristic-features/real-time-translation"
import PersonalizedRecommendations from "@/components/futuristic-features/personalized-recommendations"
import { fetchCountries } from "@/lib/api"

export default async function Home() {
  // Fetch countries for recommendations
  const countries = await fetchCountries()

  return (
    <main className="min-h-screen">
      <EnhancedHero />

      {/* Interactive Map Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400">
                Explore the World Interactively
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Discover countries around the globe with our interactive map. Click on any country to learn more about its
              culture, attractions, and travel tips.
            </p>
            <div className="mt-6 flex justify-center">
              <ARViewButton />
            </div>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* AI-Powered Recommendations */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-950/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400">
                AI-Powered Travel Insights
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Our advanced AI analyzes your preferences to recommend destinations tailored just for you. Try our
              real-time translation and voice assistant features for a seamless travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            <PersonalizedRecommendations countries={countries} />
            <RealTimeTranslation text="Hello! I'm planning to visit this country soon. Can you recommend some local dishes I should try?" />
          </div>
        </div>
      </section>

      <Blogs />
      <Features />

      {/* User Profile Section */}
      <section className="py-20 bg-gradient-to-b from-black to-black/90">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 dark:from-purple-400 dark:to-cyan-400">
                Your Travel Journey
              </span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Track your adventures, save favorite destinations, and plan your next trip with your personalized travel
              profile.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <UserProfile />
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  )
}
