"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, Plus, Trash2, Save, Check } from "lucide-react"

interface TravelPlannerProps {
  countryName: string
  capital: string
}

interface ItineraryItem {
  id: string
  day: number
  time: string
  activity: string
  location: string
}

export default function TravelPlanner({ countryName, capital }: TravelPlannerProps) {
  const [tripDuration, setTripDuration] = useState<number>(3)
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    {
      id: "1",
      day: 1,
      time: "09:00",
      activity: `Arrive in ${capital}`,
      location: `${capital} International Airport`,
    },
    {
      id: "2",
      day: 1,
      time: "12:00",
      activity: "City Tour",
      location: `${capital} City Center`,
    },
    {
      id: "3",
      day: 1,
      time: "19:00",
      activity: "Dinner",
      location: "Local Restaurant",
    },
    {
      id: "4",
      day: 2,
      time: "10:00",
      activity: "Museum Visit",
      location: `National Museum of ${countryName}`,
    },
    {
      id: "5",
      day: 2,
      time: "15:00",
      activity: "Shopping",
      location: "Local Market",
    },
    {
      id: "6",
      day: 3,
      time: "09:00",
      activity: "Day Trip",
      location: "Nearby Attraction",
    },
    {
      id: "7",
      day: 3,
      time: "18:00",
      activity: "Farewell Dinner",
      location: "Traditional Restaurant",
    },
  ])
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    day: 1,
    time: "12:00",
    activity: "",
    location: "",
  })
  const [isAddingItem, setIsAddingItem] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState<boolean>(false)

  // Add new itinerary item
  const addItineraryItem = () => {
    if (newItem.activity && newItem.location) {
      const item: ItineraryItem = {
        id: Date.now().toString(),
        day: newItem.day || 1,
        time: newItem.time || "12:00",
        activity: newItem.activity,
        location: newItem.location,
      }

      setItinerary([...itinerary, item])
      setNewItem({
        day: 1,
        time: "12:00",
        activity: "",
        location: "",
      })
      setIsAddingItem(false)
      setIsSaved(false)
    }
  }

  // Remove itinerary item
  const removeItineraryItem = (id: string) => {
    setItinerary(itinerary.filter((item) => item.id !== id))
    setIsSaved(false)
  }

  // Save itinerary
  const saveItinerary = () => {
    // In a real app, you would save to a database or localStorage
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  // Group itinerary by day
  const itineraryByDay = itinerary.reduce(
    (acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = []
      }
      acc[item.day].push(item)
      return acc
    },
    {} as Record<number, ItineraryItem[]>,
  )

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Trip Planner for {countryName}</h3>
        <button
          onClick={saveItinerary}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          title="Save itinerary"
        >
          {isSaved ? <Check className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Trip duration selector */}
        <div>
          <label htmlFor="trip-duration" className="block text-sm text-white/70 mb-1">
            Trip Duration (days)
          </label>
          <div className="flex items-center">
            <input
              id="trip-duration"
              type="range"
              min="1"
              max="14"
              value={tripDuration}
              onChange={(e) => setTripDuration(Number(e.target.value))}
              className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-3 text-white font-medium">{tripDuration}</span>
          </div>
        </div>

        {/* Itinerary */}
        <div className="space-y-4">
          {Array.from({ length: tripDuration }).map((_, dayIndex) => {
            const day = dayIndex + 1
            const dayItems = itineraryByDay[day] || []

            return (
              <div key={`day-${day}`} className="space-y-2">
                <h4 className="text-white font-medium">Day {day}</h4>

                {dayItems.length > 0 ? (
                  <div className="space-y-2">
                    {dayItems
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start p-2 bg-white/5 border border-white/10 rounded-lg group"
                        >
                          <div className="flex-shrink-0 w-16 text-white/70 text-sm">{item.time}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium">{item.activity}</div>
                            <div className="flex items-center text-white/70 text-sm">
                              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItineraryItem(item.id)}
                            className="p-1 rounded-full bg-white/0 hover:bg-white/10 text-white/0 group-hover:text-white/70 hover:text-white transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white/50 text-sm text-center">
                    No activities planned for this day
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add new item form */}
        {isAddingItem ? (
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="new-day" className="block text-sm text-white/70 mb-1">
                  Day
                </label>
                <select
                  id="new-day"
                  value={newItem.day}
                  onChange={(e) => setNewItem({ ...newItem, day: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white appearance-none"
                >
                  {Array.from({ length: tripDuration }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-time" className="block text-sm text-white/70 mb-1">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-white/50" />
                  </div>
                  <input
                    id="new-time"
                    type="time"
                    value={newItem.time}
                    onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="new-activity" className="block text-sm text-white/70 mb-1">
                Activity
              </label>
              <input
                id="new-activity"
                type="text"
                value={newItem.activity}
                onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                placeholder="What are you planning to do?"
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
              />
            </div>

            <div>
              <label htmlFor="new-location" className="block text-sm text-white/70 mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-white/50" />
                </div>
                <input
                  id="new-location"
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="Where will this take place?"
                  className="w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-white"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={addItineraryItem}
                disabled={!newItem.activity || !newItem.location}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:hover:bg-purple-600"
              >
                Add to Itinerary
              </button>
              <button
                onClick={() => setIsAddingItem(false)}
                className="py-2 px-4 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-white transition-colors flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </button>
        )}

        {/* Tips */}
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <h4 className="text-purple-400 font-medium mb-1">Travel Tips for {countryName}</h4>
          <ul className="text-white/70 text-sm space-y-1">
            <li>• Best time to visit: Check seasonal weather patterns</li>
            <li>• Local transportation: Research options in advance</li>
            <li>• Cultural etiquette: Learn basic customs and phrases</li>
            <li>• Emergency contacts: Save local emergency numbers</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
