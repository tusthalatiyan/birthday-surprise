import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'

const nameFrames = ['V', 'Vi', 'Vid', 'Vidu', 'Vidus', 'Vidushi 💖']

export default function NameReveal({ onContinue, onTick }) {
  const [index, setIndex] = useState(0)
  const finished = index === nameFrames.length - 1
  const displayName = useMemo(() => nameFrames[index], [index])

  useEffect(() => {
    onTick?.()
  }, [index, onTick])

  useEffect(() => {
    if (finished) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setIndex((current) => Math.min(current + 1, nameFrames.length - 1))
    }, 480)

    return () => window.clearTimeout(timer)
  }, [finished, index])

  return (
    <motion.section
      key="name-reveal"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(226,216,255,0.72),transparent_26%),linear-gradient(180deg,rgba(255,247,251,0.97),rgba(250,244,255,0.92),rgba(255,248,241,0.94))]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="section-label text-xs uppercase tracking-[0.3em]">name reveal</div>

        <motion.h1
          key={displayName}
          initial={{ opacity: 0, scale: 0.8, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="section-title mt-8 !text-[clamp(4rem,15vw,8rem)]"
        >
          {displayName}
        </motion.h1>

        {finished ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex max-w-3xl flex-col items-center"
          >
            <p className="section-copy text-center text-[1.06rem] sm:text-[1.2rem]">
              8 May was the day the universe(uncle & aunty) made something beautiful ✨
            </p>
            <button type="button" onClick={onContinue} className="magic-button mt-8">
              Keep the magic going
              <ChevronRight size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[rgba(93,79,109,0.62)]">
            <Sparkles size={16} className="text-rose-300" />
            stitching the prettiest name into the sky
          </div>
        )}
      </div>
    </motion.section>
  )
}
