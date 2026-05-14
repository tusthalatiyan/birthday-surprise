import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Heart, Sparkles } from 'lucide-react'
import { createId } from '../utils/helpers'

export default function ReasonsSection({ reasons, onReveal, onComplete }) {
  const [revealedCount, setRevealedCount] = useState(0)
  const [bursts, setBursts] = useState([])
  const completionSentRef = useRef(false)

  useEffect(() => {
    if (revealedCount === reasons.length && reasons.length && !completionSentRef.current) {
      completionSentRef.current = true
      onComplete?.(revealedCount)
    }
  }, [onComplete, reasons.length, revealedCount])

  const visibleReasons = useMemo(() => reasons.slice(0, revealedCount), [reasons, revealedCount])

  const revealNextReason = () => {
    const nextReason = reasons[revealedCount]
    if (!nextReason) {
      return
    }

    setRevealedCount((current) => current + 1)
    onReveal?.(nextReason)

    const nextBursts = [...Array(7)].map((_, index) => ({
      id: createId(),
      left: `${22 + index * 9}%`,
      top: `${index % 2 === 0 ? 42 : 68}%`,
      emoji: index % 2 === 0 ? '✨' : '💖',
    }))

    setBursts(nextBursts)
    window.setTimeout(() => setBursts([]), 900)
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="section-label text-xs uppercase tracking-[0.24em]">reasons you are special</p>
          <h2 className="section-title !mt-5 !text-[clamp(2.6rem,6vw,4.3rem)]">Ten little proofs that Vidushi is magic</h2>
          <p className="section-copy">
            Tap to reveal each reason one by one. Every card shows up like a tiny love note.
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={revealNextReason}
            disabled={revealedCount >= reasons.length}
            className="magic-button disabled:cursor-default disabled:opacity-60"
          >
            {revealedCount >= reasons.length ? 'All reasons unlocked' : 'Reveal another reason'}
            <ChevronRight size={18} />
          </button>

          <AnimatePresence>
            {bursts.map((burst) => (
              <motion.span
                key={burst.id}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -26, scale: 1.1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute text-lg"
                style={{ left: burst.left, top: burst.top }}
              >
                {burst.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-[rgba(93,79,109,0.7)]">
        <Heart size={15} className="text-rose-400" fill="currentColor" />
        {revealedCount}/{reasons.length} revealed
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {visibleReasons.map((reason, index) => (
            <motion.article
              key={reason.title}
              initial={{ opacity: 0, y: 26, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: Math.min(index * 0.05, 0.35) }}
              whileHover={{ y: -8 }}
              className="glass-card relative overflow-hidden rounded-[1.8rem] p-5"
            >
              <div className="absolute right-4 top-4 rounded-full bg-rose-100/80 p-2 text-rose-400">
                <Sparkles size={16} />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[rgba(93,79,109,0.52)]">
                reason {index + 1}
              </p>
              <h3 className="mt-3 text-xl font-extrabold text-[var(--ink-strong)]">{reason.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[rgba(93,79,109,0.78)]">{reason.detail}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
