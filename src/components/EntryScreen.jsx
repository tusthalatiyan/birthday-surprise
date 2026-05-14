import { motion } from 'framer-motion'
import { ChevronRight, Heart, Sparkles, Stars } from 'lucide-react'

const floatingDecor = [
  { icon: Heart, left: '8%', top: '18%', delay: 0.1, color: 'text-rose-300' },
  { icon: Stars, left: '18%', top: '70%', delay: 0.6, color: 'text-sky-200' },
  { icon: Sparkles, left: '76%', top: '20%', delay: 0.35, color: 'text-violet-300' },
  { icon: Heart, left: '84%', top: '72%', delay: 0.85, color: 'text-pink-300' },
  { icon: Stars, left: '48%', top: '11%', delay: 1.1, color: 'text-amber-200' },
]

export default function EntryScreen({ onBegin }) {
  return (
    <motion.section
      key="entry-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-16"
    >
      <div className="sparkle-mist absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(230,220,255,0.7),transparent_26%),linear-gradient(180deg,rgba(255,249,252,0.95),rgba(251,241,255,0.88),rgba(255,245,238,0.92))]" />

      {floatingDecor.map(({ icon: Icon, left, top, delay, color }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{ left, top }}
          animate={{ y: [0, -18, 0], rotate: [0, 10, -6, 0], opacity: [0.5, 1, 0.7] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, delay }}
        >
          <Icon size={index % 2 === 0 ? 28 : 22} />
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-label text-xs uppercase tracking-[0.26em]"
        >
          dreamy birthday portal
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="section-title title-glow mt-7 max-w-4xl !text-[clamp(3.25rem,11vw,7.1rem)]"
        >
          Sheetal has something special for you cutie💖
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="section-copy mt-4 text-center text-[1.08rem] sm:text-[1.18rem]"
        >
          A tiny storybook of sparkle, softness, and birthday feelings made specially for Vidushi.
        </motion.p>

        <motion.button
          type="button"
          onClick={onBegin}
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.64 }}
          className="magic-button mt-10"
        >
          Tap to Begin ✨
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </motion.section>
  )
}
