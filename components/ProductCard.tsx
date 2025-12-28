'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProductCardProps {
  name: string
  description: string
  price: string
  image: string
  href?: string
  index?: number
}

export default function ProductCard({ name, description, price, image, href = '/menu', index = 0 }: ProductCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current && isHovering) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * 8
        const rotateY = ((centerX - x) / centerX) * 8

        setMousePosition({ x: rotateY, y: rotateX })
      }
    }

    if (isHovering) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isHovering])

  const handleMouseLeave = () => {
    setIsHovering(false)
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="product-card-3d card-hover bg-white rounded-3xl p-6 shadow-lg"
      style={{
        transform: isHovering
          ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateY(-10px)`
          : 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)',
      }}
    >
      <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="text-xl font-heading font-semibold mb-2 text-primary">{name}</h3>
      <p className="text-coffee/70 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">{price}</span>
        <Link
          href={href}
          className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  )
}

