import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Heart, Sparkles, Stars } from 'lucide-react'

const icons = [Sparkles, Heart, Stars, Gift]

export default function LoadingScreen({
  onComplete,
  compact = false,
  text = 'Preparing something magical... ✨',
}) {
  const [progress, setProgress] = useState(compact ? 68 : 0)
  const completedRef = useRef(false)
  const startTimeRef = useRef(0)

  useEffect(() => {
    if (compact || !onComplete) {
      return undefined
    }

    const duration = 3200
    startTimeRef.current = Date.now()

    const timer = window.setInterval(() => {
      setProgress(() => {
        const elapsed = Date.now() - startTimeRef.current
        const ratio = Math.min(elapsed / duration, 1)
        const eased = 1 - (1 - ratio) ** 3
        const next = eased * 100

        if (next >= 100 && !completedRef.current) {
          completedRef.current = true
          window.setTimeout(onComplete, 520)
        }

        return next
      })
    }, 80)

    return () => window.clearInterval(timer)
  }, [compact, onComplete])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`relative isolate overflow-hidden ${compact ? 'min-h-[18rem] rounded-[2rem]' : 'min-h-screen'}`}
    >
      <div className="sparkle-mist absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),transparent_45%),linear-gradient(180deg,rgba(255,248,252,0.95),rgba(250,243,255,0.84),rgba(255,246,238,0.88))]" />

      <div
        className={`relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-12 text-center ${
          compact ? 'min-h-[18rem]' : 'min-h-screen'
        }`}
      >
        <div className="mb-8 flex gap-3">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -10, 0], rotate: [0, index % 2 === 0 ? 8 : -8, 0] }}
              transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, delay: index * 0.16 }}
              className="glass-chip flex h-14 w-14 items-center justify-center rounded-2xl text-[var(--ink-strong)]"
            >
              <Icon size={20} className="text-rose-400" />
            </motion.div>
          ))}
        </div>

        <p className="section-label text-xs uppercase tracking-[0.22em]">a tiny surprise is waking up</p>
        <h1 className="section-title hero-glow !mt-5 !text-[clamp(2.8rem,10vw,5rem)]">{text}</h1>
        <p className="section-copy mt-2 text-center">
          Soft lights, sparkles, and a little birthday magic are being stitched together.
        </p>

        <div className="glass-card mt-10 w-full max-w-xl rounded-full p-2">
          <div className="h-4 overflow-hidden rounded-full bg-white/55">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#ffd6e7,#dac9ff,#ffe6d3)] shadow-[0_0_22px_rgba(246,192,219,0.7)]"
              initial={{ width: compact ? '68%' : '0%' }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-sm font-bold text-[rgba(93,79,109,0.72)]">{Math.round(progress)}% enchanted</p>
      </div>
    </motion.section>
  )
}
