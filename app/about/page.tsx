'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Coffee, Snowflake, Sparkles, Zap } from 'lucide-react'

const values = [
  {
    icon: Coffee,
    title: 'Quality',
    description: 'We use carefully selected ingredients in every cup.',
  },
  {
    icon: Snowflake,
    title: 'Freshness',
    description: 'Every drink is made to be refreshing and energizing.',
  },
  {
    icon: Sparkles,
    title: 'Creativity',
    description: 'We constantly innovate new flavors and ideas.',
  },
  {
    icon: Zap,
    title: 'Youth Energy',
    description: 'Our brand is built for movement, ambition, and passion.',
  },
]

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary mb-6">
              About Dr.Coffee
            </h1>
          </div>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassy-card rounded-3xl p-4 md:p-6 backdrop-blur-md"
          >
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/image/model images/IMG_7212.JPG"
                alt="About Dr.Coffee"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glassy-card rounded-3xl p-6 md:p-8 backdrop-blur-md"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
              Our Story
            </h2>
            <p className="text-lg text-coffee/80 mb-6">
              Dr.Coffee was created with one goal in mind:<br />
              to redefine the coffee experience for a new generation.
            </p>
            <p className="text-lg text-coffee/80">
              We blend quality ingredients, bold flavors, and modern design<br />
              to create drinks that feel as good as they taste.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 relative z-10"
        >
          <div className="glassy-card rounded-3xl p-8 md:p-12 backdrop-blur-md mb-8">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary text-center mb-8">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-coffee/70">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Additional Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="glassy-card rounded-3xl p-4 md:p-6 backdrop-blur-md">
            <div className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="/image/model images/IMG_7213.JPG"
                alt="Dr.Coffee Experience"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

