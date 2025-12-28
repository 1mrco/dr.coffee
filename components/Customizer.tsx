'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface CustomizationOption {
  id: string
  name_en: string
  name_ar: string
  price: number
}

interface CustomizerProps {
  options: CustomizationOption[]
  onClose: () => void
  onAdd: (option: CustomizationOption) => void
  selectedOptions: string[]
}

export default function Customizer({ options, onClose, onAdd, selectedOptions }: CustomizerProps) {
  const [selected, setSelected] = useState<string[]>(selectedOptions)

  const toggleOption = (optionId: string) => {
    if (selected.includes(optionId)) {
      setSelected(selected.filter((id) => id !== optionId))
    } else {
      setSelected([...selected, optionId])
    }
    const option = options.find((opt) => opt.id === optionId)
    if (option) {
      onAdd(option)
    }
  }

  const totalPrice = selected.reduce((sum, optionId) => {
    const option = options.find((opt) => opt.id === optionId)
    return sum + (option?.price || 0)
  }, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto glassy-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-heading font-bold text-primary">
            Customise Like a Chemist
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <X size={20} className="text-primary" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${
                selected.includes(option.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="font-semibold text-primary">{option.name_en}</p>
                  <p className="text-sm text-coffee/70">{option.name_ar}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">+{option.price.toLocaleString()} IQD</span>
                  {selected.includes(option.id) && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Plus size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {totalPrice > 0 && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-primary">Total Additions:</span>
              <span className="text-xl font-bold text-primary">
                +{totalPrice.toLocaleString()} IQD
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-primary text-white py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

