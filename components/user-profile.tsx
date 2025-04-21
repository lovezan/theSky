"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, MapPin, Calendar, LogOut, Edit, Camera, Check } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

export default function UserProfile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    bio: "Travel enthusiast exploring the world one country at a time.",
    location: "New York, USA",
    joinedDate: "January 2023",
    visitedCountries: 12,
    wishlistCountries: 25,
    interests: ["Adventure", "Culture", "Food", "Photography"],
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [editedProfile, setEditedProfile] = useState({ ...profile })

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name,
      }))
      setEditedProfile((prev) => ({
        ...prev,
        name: user.name,
      }))
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile(editedProfile)
    }
    setIsEditing(!isEditing)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    })
  }

  const handleInterestToggle = (interest) => {
    if (editedProfile.interests.includes(interest)) {
      setEditedProfile({
        ...editedProfile,
        interests: editedProfile.interests.filter((i) => i !== interest),
      })
    } else {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, interest],
      })
    }
  }

  if (!user) {
    return (
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <User className="h-12 w-12 mx-auto mb-4 text-white/50" />
        <h3 className="text-white font-medium mb-2">Not Logged In</h3>
        <p className="text-white/70 mb-4">Please log in to view your profile</p>
        <div className="flex justify-center space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-white transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Profile header */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600/30 to-blue-600/30">
        <div className="absolute -bottom-12 left-6 rounded-full border-4 border-black/30 overflow-hidden">
          <div className="relative w-24 h-24 bg-black/50">
            <img src={profile.avatar || "/placeholder.svg"} alt={profile.name} className="w-full h-full object-cover" />
            {isEditing && (
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <Camera className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <button
            onClick={handleEditToggle}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors mr-2"
            title={isEditing ? "Save profile" : "Edit profile"}
          >
            {isEditing ? <Check className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/70 hover:text-white transition-colors"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Profile content */}
      <div className="p-6 pt-16">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-white/70 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={editedProfile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm text-white/70 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={editedProfile.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm text-white/70 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={editedProfile.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {["Adventure", "Culture", "Food", "Photography", "Nature", "History", "Relaxation", "Wildlife"].map(
                  (interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        editedProfile.interests.includes(interest)
                          ? "bg-purple-600 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      } transition-colors`}
                    >
                      {interest}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>

            <div className="flex items-center text-white/70 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{profile.location}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Joined {profile.joinedDate}</span>
            </div>

            <p className="text-white/80 mb-6">{profile.bio}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{profile.visitedCountries}</div>
                <div className="text-sm text-white/70">Countries Visited</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-white">{profile.wishlistCountries}</div>
                <div className="text-sm text-white/70">Wishlist Countries</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
