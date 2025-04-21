// Replace the entire file with this updated version that uses localStorage

export interface User {
  id: string
  name: string
  email: string
}

// Simulated database of users
const users: Record<string, User & { password: string }> = {
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

// Local storage keys
const AUTH_TOKEN_KEY = "skytrails_auth_token"
const USER_DATA_KEY = "skytrails_user_data"

// Generate a simple token (in a real app, use a proper JWT)
const generateToken = (userId: string): string => {
  return `token_${userId}_${Date.now()}`
}

// Store auth data in localStorage
const setAuthData = (token: string, user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  }
}

// Remove auth data from localStorage
const removeAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  }
}

// Get current user from localStorage
export const getCurrentUser = async (): Promise<User | null> => {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem(USER_DATA_KEY)
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    if (!userData || !token) return null

    // In a real app, you would verify the token with your backend
    return JSON.parse(userData) as User
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
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

  // Generate token and store auth data
  const token = generateToken(user.id)
  const userData = { id: user.id, name: user.name, email: user.email }
  setAuthData(token, userData)

  return userData
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

  // Generate token and store auth data
  const token = generateToken(id)
  const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
  setAuthData(token, userData)

  return userData
}

// Logout user
export const logoutUser = async (): Promise<void> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  removeAuthData()
}
