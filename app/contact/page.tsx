'use client'

import { motion } from 'framer-motion'
import { Phone, MessageCircle, Instagram, MapPin } from 'lucide-react'

const contactMethods = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+964 777 227 0005',
    href: 'tel:+9647772270005',
    color: 'bg-primary',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+964 777 227 0005',
    href: 'https://wa.me/9647772270005',
    color: 'bg-green-500',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@dr.cofffee',
    href: 'https://instagram.com/dr.cofffee',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
]

export default function ContactPage() {
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
            Get in Touch
          </h1>
          <p className="text-lg text-coffee/70 max-w-2xl mx-auto">
            We're always happy to hear from you.<br />
            Contact us anytime to place an order or ask a question.
          </p>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 relative z-10">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.label}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassy-card rounded-3xl p-6 md:p-8 text-center backdrop-blur-md hover:shadow-xl transition-shadow card-hover"
            >
              <div className={`w-16 h-16 mx-auto mb-6 ${method.color} rounded-full flex items-center justify-center`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">
                {method.label}
              </h3>
              <p className="text-coffee/70">{method.value}</p>
            </motion.a>
          ))}
        </div>

        {/* Map Section (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glassy-card rounded-3xl p-6 md:p-10 backdrop-blur-md mb-12 relative z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <MapPin className="w-8 h-8 text-primary" />
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
              Visit Us
            </h2>
          </div>
          <div className="bg-cream/50 backdrop-blur-sm rounded-2xl h-64 md:h-96 flex items-center justify-center">
            <p className="text-coffee/60">Google Map integration can be added here</p>
          </div>
        </motion.div>

        {/* Quick Order CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-6">
            Ready to Order?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
                href="https://wa.me/9647772270005"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-600"
            >
              Order via WhatsApp
            </a>
            <a
              href="/menu"
              className="bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/10 transition-colors"
            >
              View Menu
            </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

