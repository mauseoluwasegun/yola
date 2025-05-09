"use client"

import { useState, useEffect, useRef } from "react"
import { Clock } from "lucide-react"

export default function TypingGreeting() {
  const [greeting, setGreeting] = useState("")
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState("")
  const typingSpeed = 50 // milliseconds per character
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Get the appropriate greeting based on time of day
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      let greeting = ""
      let timeOfDay = ""

      if (hour >= 5 && hour < 12) {
        greeting = "Good morning"
        timeOfDay = "morning"
      } else if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon"
        timeOfDay = "afternoon"
      } else {
        greeting = "Good evening"
        timeOfDay = "evening"
      }

      return { greeting, timeOfDay }
    }

    const { greeting, timeOfDay } = getGreeting()
    setGreeting(`${greeting}, IROKO.`)
    setTimeOfDay(timeOfDay)

    // Update greeting every minute
    const intervalId = setInterval(() => {
      const { greeting, timeOfDay } = getGreeting()
      setGreeting(`${greeting}, IROKO.`)
      setTimeOfDay(timeOfDay)
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // Typing effect
  useEffect(() => {
    if (!greeting) return

    let currentIndex = 0
    setDisplayText("")
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (currentIndex < greeting.length) {
        setDisplayText((prev) => prev + greeting.charAt(currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [greeting])

  // Blinking cursor effect
  useEffect(() => {
    if (!cursorRef.current) return

    const blinkInterval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === "0" ? "1" : "0"
      }
    }, 500)

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="min-h-[120px] md:min-h-[150px]">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            {displayText}
            <span
              ref={cursorRef}
              className={`inline-block w-[2px] h-[1em] bg-gray-800 dark:bg-gray-100 ml-1 ${isTyping ? "opacity-0" : "opacity-1"}`}
            ></span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-2">How can I help you today?</p>

          <div className="mt-6 text-gray-600 dark:text-gray-300">
            <p className="text-sm md:text-base">It's a beautiful {timeOfDay}. What would you like to do today?</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600 dark:text-gray-300"
              >
                <path d="M22 2L11 13"></path>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
