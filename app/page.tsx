'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, Snowflake, Coffee, Palette, MessageCircle, Phone, Instagram } from 'lucide-react'

export default function Home() {
  const brandValues = [
    { icon: Zap, text: 'Energy that lasts' },
    { icon: Snowflake, text: 'Always fresh' },
    { icon: Coffee, text: 'Premium quality' },
    { icon: Palette, text: 'Designed with style' },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 text-center">
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary mb-6"
          >
            START YOUR DAY<br />THE RIGHT WAY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-coffee/80 mb-8 max-w-2xl mx-auto"
          >
            Fresh coffee. Bold flavors.<br />
            Crafted to keep you energized and focused.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/menu"
              className="btn-primary bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg"
            >
              ORDER NOW
            </Link>
            <Link
              href="/menu"
              className="bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/10 transition-colors"
            >
              VIEW MENU
            </Link>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Message Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">
              More Than Coffee
            </h2>
            <p className="text-lg text-coffee/80 mb-12">
              Dr.Coffee is not just a drink.<br />
              It's a daily boost of energy, creativity, and mood.<br />
              Designed for people who move fast, think sharp, and live fully.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {brandValues.map((value, index) => (
                <motion.div
                  key={value.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-semibold text-primary">{value.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="glassy-card rounded-3xl p-4 md:p-6 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
                className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden"
            >
              <Image
                src="/image/model images/IMG_7211.JPG"
                alt="Lifestyle"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glassy-card rounded-3xl p-6 md:p-8 backdrop-blur-md"
            >
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">
                Coffee That Fits Your Lifestyle
              </h2>
              <p className="text-lg text-coffee/80 mb-8">
                Whether you're on your way to work, meeting friends, or taking a break —<br />
                Dr.Coffee is always the right choice.
              </p>
              <Link
                href="/menu"
                className="btn-primary bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg inline-block"
              >
                Explore Menu
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(31, 61, 43, 0.85) 0%, rgba(31, 61, 43, 0.75) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white">
              Order Without Leaving Your Car
            </h2>
            <p className="text-xl mb-12 text-cream/90">
              Fast. Easy. Convenient.<br />
              Get your favorite Dr.Coffee drink in just a few steps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/9647772270005"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 hover:bg-cream transition-colors"
              >
                <MessageCircle size={24} />
                Order via WhatsApp
              </a>
              <a
                href="tel:+9647772270005"
                className="bg-white/10 border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-colors"
              >
                <Phone size={24} />
                Call Now
              </a>
              <a
                href="https://instagram.com/dr.cofffee"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-colors"
              >
                <Instagram size={24} />
                Instagram DM
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

