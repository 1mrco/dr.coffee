'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] glassy-card backdrop-blur-md px-6 py-4 rounded-full shadow-lg flex items-center gap-3"
          onAnimationComplete={() => {
            setTimeout(() => {
              onClose()
            }, 2000)
          }}
        >
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-primary font-semibold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

