'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Coffee, MessageCircle, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Coffee,
    title: 'Choose Your Drink',
    description: 'Browse our menu and pick your favorite flavor.',
  },
  {
    number: 2,
    icon: MessageCircle,
    title: 'Contact Us',
    description: 'Order via WhatsApp, call, or Instagram.',
  },
  {
    number: 3,
    icon: CheckCircle,
    title: 'Enjoy Your Coffee',
    description: 'Sit back and enjoy your Dr.Coffee experience.',
  },
]

export default function HowToOrderPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6">
            How to Order
          </h1>
          <p className="text-lg text-coffee/70 max-w-2xl mx-auto">
            Getting your favorite Dr.Coffee is simple and fast.
          </p>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glassy-card rounded-3xl p-6 md:p-8 text-center backdrop-blur-md relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl z-10">
                {step.number}
              </div>
              <div className="mt-6 mb-6 flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-heading font-semibold text-primary mb-4">
                {step.title}
              </h3>
              <p className="text-coffee/70">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glassy-card rounded-3xl p-6 md:p-10 backdrop-blur-md mb-12 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary text-center mb-8">
            Order Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://wa.me/9647772270005"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-6 py-4 rounded-2xl font-semibold text-center flex items-center justify-center gap-3 hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={24} />
              WhatsApp
            </a>
            <a
              href="tel:+9647772270005"
              className="bg-primary text-white px-6 py-4 rounded-2xl font-semibold text-center flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
            >
              <MessageCircle size={24} />
              Call Now
            </a>
            <a
              href="https://instagram.com/dr.cofffee"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-semibold text-center flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={24} />
              Instagram DM
            </a>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 backdrop-blur-md inline-block">
          <Link
            href="/menu"
            className="btn-primary bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg inline-block"
          >
            View Menu
          </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

