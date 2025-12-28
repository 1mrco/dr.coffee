'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

interface ParallaxElement {
  src: string
  alt: string
  width: number
  height: number
  x: number
  y: number
  depth: number // 0-1, where 1 is closest (moves most)
  rotation?: number
  scale?: number
}

export default function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  // Use window scroll for smoother tracking
  const { scrollY } = useScroll({
    layoutEffect: false, // Better performance
  })
  
  // Mouse parallax values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  // Smoother spring animations
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 25, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { stiffness: 30, damping: 25, mass: 0.5 })

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Parallax elements with different depths
  const parallaxElements: ParallaxElement[] = [
    // Background layer (deepest, moves least)
    { src: '/stickers/Dr. coffee green.png', alt: 'Dr Coffee', width: 200, height: 200, x: 5, y: 10, depth: 0.1, rotation: -15, scale: 1.2 },
    { src: '/stickers/Caf Bar 2.png', alt: 'Caf Bar', width: 180, height: 180, x: 85, y: 20, depth: 0.15, rotation: 10 },
    { src: '/stickers/Test Tube.png', alt: 'Test Tube', width: 120, height: 120, x: 15, y: 60, depth: 0.12, rotation: -5 },
    
    // Mid layer
    { src: '/stickers/Flask yellow green.png', alt: 'Flask', width: 150, height: 150, x: 70, y: 50, depth: 0.3, rotation: 15 },
    { src: '/stickers/lab Tube yellow green.png', alt: 'Lab Tube', width: 100, height: 100, x: 25, y: 75, depth: 0.25, rotation: -10 },
    { src: '/stickers/Cookie green.png', alt: 'Cookie', width: 130, height: 130, x: 80, y: 15, depth: 0.28, rotation: 20 },
    { src: '/stickers/Banana Green.png', alt: 'Banana', width: 110, height: 110, x: 10, y: 40, depth: 0.22, rotation: -8 },
    
    // Foreground layer (closest, moves most)
    { src: '/stickers/customise like a chemist.png', alt: 'Customise', width: 160, height: 160, x: 50, y: 30, depth: 0.5, rotation: -12 },
    { src: '/stickers/raspberry.png', alt: 'Raspberry', width: 90, height: 90, x: 30, y: 55, depth: 0.45, rotation: 18 },
    { src: '/stickers/Milk Box yellow green.png', alt: 'Milk Box', width: 140, height: 140, x: 65, y: 5, depth: 0.48, rotation: 5 },
    { src: '/stickers/Espresso addition.png', alt: 'Espresso', width: 100, height: 100, x: 20, y: 25, depth: 0.42, rotation: -15 },
    { src: '/stickers/Yogurt.png', alt: 'Yogurt', width: 120, height: 120, x: 75, y: 65, depth: 0.4, rotation: 12 },
    
    // Additional decorative elements
    { src: '/stickers/Smoothies.png', alt: 'Smoothies', width: 110, height: 110, x: 40, y: 80, depth: 0.35, rotation: -20 },
    { src: '/stickers/Tea.png', alt: 'Tea', width: 95, height: 95, x: 90, y: 45, depth: 0.38, rotation: 25 },
  ]

  // Handle mouse movement - smoother tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Normalize to -1 to 1 range for smoother movement
      const x = ((e.clientX - centerX) / rect.width) * 2
      const y = ((e.clientY - centerY) / rect.height) * 2
      
      // Set values that will be smoothly interpolated by spring
      mouseX.set(x * 50) // Max 50px movement
      mouseY.set(y * 50)
    }

    const handleMouseLeave = () => {
      // Smoothly return to center when mouse leaves
      mouseX.set(0)
      mouseY.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ 
        perspective: '1000px',
        willChange: 'transform',
        transform: 'translateZ(0)', // Force GPU acceleration
      }}
    >
      {parallaxElements.map((element, index) => {
        // Scroll-based parallax - moves in scroll direction
        // Use a larger range for smoother scrolling
        const scrollRange = 2000 // Increased for smoother movement
        const scrollXOffset = useTransform(scrollY, [0, scrollRange], [0, 40 * element.depth])
        const scrollYOffset = useTransform(scrollY, [0, scrollRange], [0, 60 * element.depth])
        
        // Mouse-based parallax (more pronounced for closer elements, reduced on mobile)
        const parallaxIntensity = isMobile ? 0.3 : 0.8
        const mouseParallaxX = useTransform(smoothMouseX, (x) => x * element.depth * parallaxIntensity)
        const mouseParallaxY = useTransform(smoothMouseY, (y) => y * element.depth * parallaxIntensity)
        
        // Combine scroll and mouse parallax - simple addition of pixel offsets
        const combinedX = useTransform(
          [scrollXOffset, mouseParallaxX],
          ([scroll, mouse]) => {
            return (scroll as number) + (mouse as number)
          }
        )
        const combinedY = useTransform(
          [scrollYOffset, mouseParallaxY],
          ([scroll, mouse]) => {
            return (scroll as number) + (mouse as number)
          }
        )

        // 3D rotation based on mouse (reduced on mobile)
        const rotationIntensity = isMobile ? 0.05 : 0.15
        const rotateX = useTransform(smoothMouseY, (my) => my * element.depth * rotationIntensity)
        const rotateY = useTransform(smoothMouseX, (mx) => mx * element.depth * rotationIntensity)

        // Floating rotation animation based on scroll
        const baseRotation = element.rotation || 0
        const floatingRotate = useTransform(
          scrollY,
          [0, scrollRange],
          [baseRotation, baseRotation + 15 * element.depth]
        )

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              x: combinedX,
              y: combinedY,
              rotateX,
              rotateY,
              rotateZ: floatingRotate,
              scale: element.scale || 1,
              transformStyle: 'preserve-3d',
              opacity: 0.4 + element.depth * 0.5,
              zIndex: Math.floor(element.depth * 10),
              willChange: 'transform',
            }}
            animate={{
              scale: [element.scale || 1, (element.scale || 1) * 1.05, element.scale || 1],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          >
            <Image
              src={element.src}
              alt={element.alt}
              width={element.width}
              height={element.height}
              priority={element.src === '/stickers/Dr. coffee green.png'}
              className="object-contain drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
              }}
            />
          </motion.div>
        )
      })}
      
      {/* Additional floating drink images */}
      <motion.div
        className="absolute top-10 right-5 opacity-30"
        style={{
          width: '160px',
          height: '160px',
          x: useTransform(scrollY, [0, 2000], [0, 80]),
          y: useTransform(scrollY, [0, 2000], [0, 150]),
          rotateX: useTransform(smoothMouseY, (y) => y * 0.08),
          rotateY: useTransform(smoothMouseX, (x) => x * 0.08),
          willChange: 'transform',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image
          src="/image/drinks images/Photoroom_20251225_043530.PNG"
          alt="Coffee"
          width={160}
          height={160}
          className="object-contain"
          sizes="160px"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-10 opacity-25"
        style={{
          width: '128px',
          height: '128px',
          x: useTransform(scrollY, [0, 2000], [0, -50]),
          y: useTransform(scrollY, [0, 2000], [0, -120]),
          rotateX: useTransform(smoothMouseY, (y) => y * 0.1),
          rotateY: useTransform(smoothMouseX, (x) => x * 0.1),
          willChange: 'transform',
        }}
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image
          src="/image/drinks images/Photoroom_20251225_043606.PNG"
          alt="Coffee"
          width={128}
          height={128}
          className="object-contain"
          sizes="128px"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/4 opacity-28"
        style={{
          width: '144px',
          height: '144px',
          x: useTransform(scrollY, [0, 2000], [0, 60]),
          y: useTransform(scrollY, [0, 2000], [0, 100]),
          rotateX: useTransform(smoothMouseY, (y) => y * 0.08),
          rotateY: useTransform(smoothMouseX, (x) => x * 0.08),
          willChange: 'transform',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Image
          src="/image/drinks images/Photoroom_20251225_043450.PNG"
          alt="Coffee"
          width={144}
          height={144}
          className="object-contain"
          sizes="144px"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </motion.div>
    </div>
  )
}

