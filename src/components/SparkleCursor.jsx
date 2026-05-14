import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createId } from '../utils/helpers'

const glyphs = ['✨', '💖', '⭐']

export default function SparkleCursor() {
  const [sparkles, setSparkles] = useState([])
  const supportsPointer = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
    [],
  )
  const enabled = supportsPointer

  useEffect(() => {
    if (!supportsPointer) {
      return undefined
    }

    const handleMove = (event) => {
      const nextSparkle = {
        id: createId(),
        x: event.clientX,
        y: event.clientY,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      }

      setSparkles((current) => [...current.slice(-10), nextSparkle])
    }

    const handleClick = (event) => {
      const burst = [...Array(6)].map((_, index) => ({
        id: createId(),
        x: event.clientX + (index - 2) * 10,
        y: event.clientY + (index % 2 === 0 ? -10 : 12),
        glyph: index % 2 === 0 ? '✨' : '💗',
      }))

      setSparkles((current) => [...current.slice(-8), ...burst])
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerdown', handleClick)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleClick)
    }
  }, [supportsPointer])

  useEffect(() => {
    if (!sparkles.length) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setSparkles((current) => current.slice(1))
    }, 440)

    return () => window.clearTimeout(timer)
  }, [sparkles])

  if (!enabled) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[75] hidden sm:block">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0.2, x: sparkle.x, y: sparkle.y }}
            animate={{ opacity: 1, scale: 1, x: sparkle.x + 12, y: sparkle.y - 18 }}
            exit={{ opacity: 0, scale: 0.2, y: sparkle.y - 30 }}
            className="absolute text-base drop-shadow-[0_0_14px_rgba(255,255,255,0.92)]"
          >
            {sparkle.glyph}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
