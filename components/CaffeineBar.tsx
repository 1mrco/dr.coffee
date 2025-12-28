'use client'

interface CaffeineBarProps {
  level: number // 0-7
}

export default function CaffeineBar({ level }: CaffeineBarProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7].map((index) => (
        <div
          key={index}
          className={`w-4 h-4 transition-all duration-300 ${
            index <= level
              ? 'bg-primary'
              : 'bg-primary/20 border border-primary/30'
          }`}
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
      ))}
    </div>
  )
}

