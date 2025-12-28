'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import Cart from './Cart'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/about', label: 'About' },
    { href: '/how-to-order', label: 'How to Order' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glassy-card backdrop-blur-md shadow-lg'
          : 'glassy-card backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-20 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
              <Image
                src="/logo/logo.png"
                alt="Dr.Coffee Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 40px, 56px"
              />
            </div>
            <span className="text-2xl md:text-3xl font-logo text-primary">
              Dr.Coffee
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary font-medium hover:text-accent-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/menu"
              className="btn-primary bg-primary text-white px-6 py-3 rounded-full font-semibold"
            >
              ORDER NOW
            </Link>
            <Cart />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-primary/10">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-primary font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/menu"
                className="btn-primary bg-primary text-white px-6 py-3 rounded-full font-semibold text-center mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ORDER NOW
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

