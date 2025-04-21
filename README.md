# theskytrails - Travel Blog & Country Explorer

![theskytrails Logo](https://example.com/logo.png)

## Overview

theskytrails is a modern, interactive travel blog and country information platform built with Next.js. The website provides comprehensive travel guides, country information, and cultural insights to help travelers plan their journeys and explore the world.

## Features

- **Interactive Country Explorer**: Browse and search countries from around the world with advanced filtering options
- **Detailed Travel Guides**: Access comprehensive travel guides for each country with cultural insights, travel tips, and more
- **Modern UI/UX**: Enjoy a sleek, responsive design with dark/light mode support
- **Interactive Globe Visualization**: Explore countries through an interactive 3D globe with color-coded continents
- **Advanced Search**: Find countries by name, region, language, population, and more
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Blog Platform**: Read and comment on travel articles and guides
- **First-visit Animation**: Engaging loading animation for first-time visitors

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom animations and theme support
- **3D Visualization**: Three.js for the interactive globe
- **Animation**: Framer Motion for smooth UI animations
- **State Management**: React Hooks for local state management
- **API Integration**: REST Countries API for country data
- **Deployment**: Vercel

## API Integration

The website uses the [REST Countries API](https://restcountries.com/) to fetch comprehensive country data. This API provides information about:

- Basic country details (name, capital, region, etc.)
- Population and geographical data
- Languages and currencies
- Flag images
- Border countries
- Regional blocs
- And more

The API is integrated with a fallback mechanism to ensure the website functions even if the API is temporarily unavailable.

## Project Structure

\`\`\`
theskytrails/
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
\`\`\`

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
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/theskytrails.git
   cd theskytrails
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

The project is configured for easy deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure environment variables if needed
4. Deploy

## Future Enhancements

- User authentication for personalized experiences
- Saved favorites and trip planning features
- Multi-language support
- Interactive maps for each country
- Travel booking integration
- User-generated content and reviews

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [REST Countries API](https://restcountries.com/) for providing comprehensive country data
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Three.js](https://threejs.org/) for 3D visualization
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Vercel](https://vercel.com/) for hosting and deployment
