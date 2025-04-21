import Cookies from "js-cookie"

export interface User {
  id: string
  name: string
  email: string
}

// Simulated database of users
let users: Record<string, User & { password: string }> = {}

// Cookie name for auth token
const AUTH_TOKEN_COOKIE = "skytrails_auth_token"
const TOKEN_EXPIRY_DAYS = 7

// Generate a simple token (in a real app, use a proper JWT)
const generateToken = (userId: string): string => {
  return `token_${userId}_${Date.now()}`
}

// Store token in HTTP-only cookie
const setAuthCookie = (token: string): void => {
  Cookies.set(AUTH_TOKEN_COOKIE, token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
}

// Remove auth cookie
const removeAuthCookie = (): void => {
  Cookies.remove(AUTH_TOKEN_COOKIE)
}

// Get current user from token
export const getCurrentUser = async (): Promise<User | null> => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE)

  if (!token) return null

  // In a real app, you would verify the token with your backend
  // For this demo, we'll parse our simple token format
  const parts = token.split("_")
  if (parts.length !== 3 || parts[0] !== "token") return null

  const userId = parts[1]
  const user = users[userId]

  return user ? { id: user.id, name: user.name, email: user.email } : null
}

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find user by email
  const user = Object.values(users).find((u) => u.email === email)

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password")
  }

  // Generate and store token
  const token = generateToken(user.id)
  setAuthCookie(token)

  return { id: user.id, name: user.name, email: user.email }
}

// Register new user
export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if email already exists
  if (Object.values(users).some((u) => u.email === email)) {
    throw new Error("Email already in use")
  }

  // Create new user
  const id = `user_${Date.now()}`
  const newUser = { id, name, email, password }

  // Store in our "database"
  users[id] = newUser

  // Generate and store token
  const token = generateToken(id)
  setAuthCookie(token)

  return { id, name, email }
}

// Logout user
export const logoutUser = async (): Promise<void> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  removeAuthCookie()
}

// Add some sample users for testing
users = {
  user_1: {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  user_2: {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
}
