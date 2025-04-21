"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AdvancedGlobe({ countries = [] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const router = useRouter()
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.z = 2.5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(size * 2, size * 2)
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Clear container and append renderer
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }
    containerRef.current.appendChild(renderer.domElement)

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 1.5
    controls.maxDistance = 4
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    controls.addEventListener("start", () => setIsInteracting(true))
    controls.addEventListener("end", () => setIsInteracting(false))

    // Create globe group
    const globe = new THREE.Group()
    globeRef.current = globe
    scene.add(globe)

    // Create base sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshBasicMaterial({
      color: isDark ? 0x111111 : 0xf5f5f5,
      transparent: true,
      opacity: 0.8,
    })
    const baseSphere = new THREE.Mesh(geometry, material)
    globe.add(baseSphere)

    // Add wireframe
    const wireframeGeometry = new THREE.SphereGeometry(1.001, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xffffff : 0x333333,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.1 : 0.2,
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    globe.add(wireframe)

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(1.02, 64, 64)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x3366ff : 0x6699ff,
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
    const sizes = []
    const countryIndices = []
    const color = new THREE.Color()

    // Generate dots for each continent
    let countryIndex = 0
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

        // Add size (slightly random)
        sizes.push(dotSize * (0.8 + Math.random() * 0.4))

        // Add country index (for interaction)
        countryIndices.push(countryIndex % countries.length)
      }
      countryIndex++
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
        sizes.push(dotSize * 0.7) // Ocean dots are smaller
        countryIndices.push(-1) // -1 indicates ocean (not clickable)
      }
    }

    dotsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    dotsGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
    dotsGeometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))
    dotsGeometry.setAttribute("countryIndex", new THREE.Float32BufferAttribute(countryIndices, 1))

    // Create shader material for dots
    const dotsMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute float countryIndex;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vCountryIndex;
        
        void main() {
          vColor = color;
          vCountryIndex = countryIndex;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vCountryIndex;
        
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
          gl_FragColor = vec4(vColor, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
    })

    const dots = new THREE.Points(dotsGeometry, dotsMaterial)
    globe.add(dots)

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Add point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x3366ff, 2, 10)
    pointLight1.position.set(2, 1, 2)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff6633, 2, 10)
    pointLight2.position.set(-2, -1, -2)
    scene.add(pointLight2)

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster()
    raycaster.params.Points = { threshold: 0.1 }
    const mouse = new THREE.Vector2()

    // Handle mouse move for hover effects
    const handleMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera)

      // Check for intersections with dots
      const intersects = raycaster.intersectObject(dots)

      if (intersects.length > 0) {
        const countryIndex = dotsGeometry.attributes.countryIndex.getX(intersects[0].index)

        if (countryIndex >= 0 && countryIndex < countries.length) {
          setHoveredCountry(countries[Math.floor(countryIndex)].name)
          document.body.style.cursor = "pointer"
        } else {
          setHoveredCountry(null)
          document.body.style.cursor = "default"
        }
      } else {
        setHoveredCountry(null)
        document.body.style.cursor = "default"
      }
    }

    // Handle click to navigate to country
    const handleClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera)

      // Check for intersections with dots
      const intersects = raycaster.intersectObject(dots)

      if (intersects.length > 0) {
        const countryIndex = dotsGeometry.attributes.countryIndex.getX(intersects[0].index)

        if (countryIndex >= 0 && countryIndex < countries.length) {
          const country = countries[Math.floor(countryIndex)]
          router.push(`/blogs/${country.alpha3Code}`)
        }
      }
    }

    renderer.domElement.addEventListener("mousemove", handleMouseMove)
    renderer.domElement.addEventListener("click", handleClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Pulse effect for glow
      const time = Date.now() * 0.001
      glowMesh.material.opacity = (isDark ? 0.05 : 0.1) + Math.sin(time) * 0.02

      // Render scene
      renderer.render(scene, camera)
    }

    // Start animation
    animate()

    // Set loaded state after a short delay
    setTimeout(() => setIsLoaded(true), 500)

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      const { size: newSize, dotSize: newDotSize } = getSize()

      // Only update if size changed
      if (size !== newSize) {
        size = newSize

        renderer.setSize(size * 2, size * 2)

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
      renderer.domElement.removeEventListener("mousemove", handleMouseMove)
      renderer.domElement.removeEventListener("click", handleClick)

      renderer.dispose()
      geometry.dispose()
      material.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      glowGeometry.dispose()
      glowMaterial.dispose()
      dotsGeometry.dispose()
      dotsMaterial.dispose()

      document.body.style.cursor = "default"
    }
  }, [theme, isDark, countries, router])

  return (
    <div className="relative flex items-center justify-center w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative w-[350px] h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mx-auto"
      >
        <div ref={containerRef} className="relative w-full h-full" />

        {/* Hover tooltip */}
        {hoveredCountry && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm pointer-events-none z-10">
            {hoveredCountry}
          </div>
        )}

        {/* Instructions */}
        <div
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs pointer-events-none transition-opacity duration-500 ${isInteracting ? "opacity-0" : "opacity-100"}`}
        >
          {isLoaded ? "Drag to rotate • Click on a region to explore" : "Loading globe..."}
        </div>
      </motion.div>
    </div>
  )
}
