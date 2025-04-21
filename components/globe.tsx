"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Determine size based on viewport
    const getSize = () => {
      const width = window.innerWidth
      if (width < 768) return { size: 150, dotSize: 0.015, dotCount: 2000 }
      if (width < 1024) return { size: 250, dotSize: 0.02, dotCount: 3000 }
      return { size: 350, dotSize: 0.025, dotCount: 5000 }
    }

    let { size, dotSize, dotCount } = getSize()

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 2

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size * 2, size * 2)
    renderer.setClearColor(0x000000, 0)

    // Clear container and append renderer
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }
    containerRef.current.appendChild(renderer.domElement)

    // Create globe
    const geometry = new THREE.SphereGeometry(1, 64, 64)

    // Material based on theme
    const material = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0x333333,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.1 : 0.2,
    })

    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(1.01, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0x333333,
      transparent: true,
      opacity: isDark ? 0.05 : 0.1,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    scene.add(glowMesh)

    // Define continent regions with colors
    const continents = [
      { name: "North America", color: isDark ? 0x4287f5 : 0x2563eb, lat: [15, 70], lng: [-170, -50], density: 0.3 },
      { name: "South America", color: isDark ? 0x42f5a7 : 0x10b981, lat: [-60, 15], lng: [-80, -30], density: 0.3 },
      { name: "Europe", color: isDark ? 0xf542cb : 0xd946ef, lat: [35, 70], lng: [-10, 40], density: 0.4 },
      { name: "Africa", color: isDark ? 0xf5a742 : 0xf59e0b, lat: [-40, 35], lng: [-20, 55], density: 0.3 },
      { name: "Asia", color: isDark ? 0xf54242 : 0xef4444, lat: [0, 70], lng: [40, 150], density: 0.3 },
      { name: "Oceania", color: isDark ? 0x42f5f2 : 0x06b6d4, lat: [-50, 0], lng: [110, 180], density: 0.2 },
    ]

    // Add dot particles for countries with continent colors
    const dotsGeometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []
    const color = new THREE.Color()

    // Generate dots for each continent
    continents.forEach((continent) => {
      const continentDotCount = Math.floor(dotCount * continent.density)
      color.set(continent.color)

      for (let i = 0; i < continentDotCount; i++) {
        // Generate random coordinates within continent bounds
        const lat = continent.lat[0] + Math.random() * (continent.lat[1] - continent.lat[0])
        const lng = continent.lng[0] + Math.random() * (continent.lng[1] - continent.lng[0])

        // Convert to radians
        const latRad = (lat * Math.PI) / 180
        const lngRad = (lng * Math.PI) / 180

        // Convert to Cartesian coordinates
        const x = Math.cos(latRad) * Math.cos(lngRad)
        const y = Math.sin(latRad)
        const z = Math.cos(latRad) * Math.sin(lngRad)

        // Add position
        positions.push(x * 1.01, y * 1.01, z * 1.01)

        // Add color
        colors.push(color.r, color.g, color.b)
      }
    })

    // Add some random dots for oceans
    color.set(isDark ? 0x42a1f5 : 0x3b82f6) // Ocean blue
    for (let i = 0; i < dotCount * 0.2; i++) {
      const phi = Math.random() * Math.PI * 2
      const theta = Math.random() * Math.PI

      const x = Math.sin(theta) * Math.cos(phi)
      const y = Math.sin(theta) * Math.sin(phi)
      const z = Math.cos(theta)

      // Check if this point is likely in an ocean (simple check)
      let isOcean = true
      for (const continent of continents) {
        // Convert back to lat/lng
        const lat = (Math.asin(y) * 180) / Math.PI
        const lng = (Math.atan2(z, x) * 180) / Math.PI

        if (lat >= continent.lat[0] && lat <= continent.lat[1] && lng >= continent.lng[0] && lng <= continent.lng[1]) {
          isOcean = false
          break
        }
      }

      if (isOcean) {
        positions.push(x * 1.01, y * 1.01, z * 1.01)
        colors.push(color.r, color.g, color.b)
      }
    }

    dotsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    dotsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    const dotsMaterial = new THREE.PointsMaterial({
      size: dotSize,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.8 : 0.9,
    })

    const dots = new THREE.Points(dotsGeometry, dotsMaterial)
    scene.add(dots)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      globe.rotation.y += 0.002
      glowMesh.rotation.y += 0.002
      dots.rotation.y += 0.002

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const { size: newSize, dotSize: newDotSize, dotCount: newDotCount } = getSize()

      // Only update if size changed
      if (size !== newSize) {
        size = newSize
        dotSize = newDotSize

        renderer.setSize(size * 2, size * 2)
        dotsMaterial.size = dotSize

        // Update container size
        containerRef.current.style.width = `${size}px`
        containerRef.current.style.height = `${size}px`
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      dotsGeometry.dispose()
      dotsMaterial.dispose()
    }
  }, [theme, isDark])

  return (
    <div className="relative flex items-center justify-center w-full">
      <div
        ref={containerRef}
        className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto animate-float"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>
      </div>
    </div>
  )
}
