# theskytrails - Travel Blog & Country Explorer

![theskytrails Logo](https://example.com/logo.png)

## Overview

theskytrails is a modern, interactive travel blog and country information platform built with Next.js. The website provides comprehensive travel guides, country information, and cultural insights to help travelers plan their journeys and explore the world.

## Features

- **User Authentication**: Secure login/signup with local storage persistence
- **Demo Accounts**: Pre-configured test users for easy exploration
- **Interactive Country Explorer**: Browse and search countries from around the world with advanced filtering options
- **Detailed Travel Guides**: Access comprehensive travel guides for each country with cultural insights, travel tips, and more
- **Modern UI/UX**: Enjoy a sleek, responsive design with dark/light mode support
- **Interactive Globe Visualization**: Explore countries through an interactive 3D globe with color-coded continents
- **Advanced Search**: Find countries by name, region, language, population, and more
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Blog Platform**: Read and comment on travel articles and guides
- **First-visit Animation**: Engaging loading animation for first-time visitors
- **Weather Widget**: Real-time weather information for each country  
- **Currency Converter**: Instantly convert between major global currencies  
- **Language Translator**: Translate basic phrases between local and global languages  
- **Travel Planner**: Create and manage custom travel itineraries  
- **User Profile System**: Personalize your experience with user profiles  
- **Social Sharing Tools**: Share blog posts and countries on social media  
- **Enhanced Hero Section**: Eye-catching landing visuals with dynamic headlines  
- **Typewriter Effect**: Animated intro text to engage users  
- **Interactive Map**: Explore countries and regions with zoomable, clickable maps  
- 
- ## Features



## Authentication

We've implemented a complete authentication system with the following features:

- Secure login/signup flow
- LocalStorage persistence for user sessions
- Protected routes for authenticated users
- Demo accounts for easy testing

### Test Users
```javascript
// Sample test users (stored in localStorage)
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
```

## ✨ How to Get Started

### Option 1: Use Test Account
1. Click **"Login"** in the navigation
2. Enter one of these test credentials:
   - Email: `john@example.com`
   - Password: `password123`
3. You'll be redirected to your personalized dashboard

### Option 2: Create New Account
1. Click **"Sign Up"** in the navigation  
2. Fill in your details:
   - **Name** (your display name)
   - **Email** (must be unique)
   - **Password** (at least 6 characters)
3. Your account will be created and stored securely
4. You'll be automatically logged in

### 🔄 Account Features
- All accounts are stored in browser localStorage
- Sessions persist across page refreshes
- Access protected user-only features after login


## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom animations and theme support
- **3D Visualization**: Three.js for the interactive globe
- **Animation**: Framer Motion for smooth UI animations
- **State Management**: React Hooks for local state management
- **API Integration**: REST Countries API for country data
- **Deployment**: Vercel

## API Integration

The website uses the [REST Countries API](https://www.apicountries.com/countries) to fetch comprehensive country data. This API provides information about:

- Basic country details (name, capital, region, etc.)
- Population and geographical data
- Languages and currencies
- Flag images
- Border countries
- Regional blocs
- And more

The API is integrated with a fallback mechanism to ensure the website functions even if the API is temporarily unavailable.
# The Sky Trails Project

## Project Structure

```bash
.
├── app/                    # Next.js App Router pages
│   ├── about/              # About page
│   ├── blogs/              # Blog posts pages
│   ├── countries/          # Countries explorer pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── ClientLayout.tsx    # Client-side layout wrapper
├── components/             # React components
│   ├── blogs.tsx           # Blog listing component
│   ├── countries/          # Country-related components
│   ├── features.tsx        # Features showcase component
│   ├── footer.tsx          # Footer component
│   ├── footer-minimal.tsx  # Minimal footer variant
│   ├── globe.tsx           # Interactive 3D globe component
│   ├── hero.tsx            # Hero section component
│   ├── loading-animation.tsx # First-visit animation
│   ├── navbar.tsx          # Navigation bar component
│   ├── newsletter.tsx      # Newsletter signup component
│   └── ui/                 # UI components (buttons, cards, etc.)
├── lib/                    # Utility functions and API handlers
│   └── api.ts              # API integration for country data
├── public/                 # Static assets
├── styles/                 # Global styles
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.mjs      # PostCSS configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## Key Components

### Globe Visualization

The interactive globe is built using Three.js and displays countries as colored dots grouped by continent. Each continent has a unique color, making it easy to visualize geographical regions. The globe rotates smoothly and includes subtle lighting effects.

### Country Explorer

The country explorer page allows users to browse all countries with advanced filtering options:
- Search by name, capital, or region
- Filter by region, population, and languages
- Sort by name, population, or area
- View detailed information about each country

### Blog System

The blog system provides travel guides for each country, including:
- Cultural information
- Travel tips
- Geographic details
- Local customs and languages
- Practical information for travelers

### Theme Support

The website supports both light and dark modes with a seamless transition between them. The theme preference is saved for returning visitors.

## Performance Optimizations

- Lazy loading of images and components
- Optimized 3D rendering for the globe
- Efficient state management to minimize re-renders
- API response caching
- Fallback data for offline functionality

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm or yarn

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/lovezan/theSky.git
   cd theskytrails
```

2. Install dependencies:
```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
```

3. Run the development server:
```bash
   pnpm run dev
   # or
   npm install
   # or
   yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

The project is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables if needed
4. Deploy

## Future Enhancements

- Saved favorites and trip planning features
- Multi-language support
- Interactive maps for each country
- Travel booking integration
- User-generated content and reviews

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [REST Countries API](https://www.apicountries.com/countries) for providing comprehensive country data
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Three.js](https://threejs.org/) for 3D visualization
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Vercel](https://vercel.com/) for hosting and deployment
