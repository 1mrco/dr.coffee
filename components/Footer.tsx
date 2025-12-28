import Link from 'next/link'
import { Instagram, Phone, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-cream py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4">Dr.Coffee</h3>
            <p className="text-cream/80 mb-4">
              Fuel Your Day. Feel the Energy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-cream/80 hover:text-white transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cream/80 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-to-order" className="text-cream/80 hover:text-white transition-colors">
                  How to Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cream/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/dr.cofffee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="tel:+9647772270005"
                className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                aria-label="Phone"
              >
                <Phone size={20} />
              </a>
              <a
                href="https://wa.me/9647772270005"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center hover:bg-cream/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-8 text-center text-cream/60">
          <p>© 2025 Dr.Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

