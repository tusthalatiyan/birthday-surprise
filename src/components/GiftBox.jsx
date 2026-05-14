import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Gift, Sparkles } from 'lucide-react'

export default function GiftBox({ onOpen, onContinue }) {
  const [phase, setPhase] = useState('sealed')
  const isOpening = phase === 'opening'
  const isOpened = phase === 'opened'

  useEffect(() => {
    if (!isOpening) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setPhase('opened')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [isOpening])

  const handleOpen = () => {
    if (phase !== 'sealed') {
      return
    }

    setPhase('opening')
    onOpen?.()
  }

  return (
    <motion.section
      key="gift-box"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,219,235,0.72),transparent_22%),linear-gradient(180deg,rgba(255,248,252,0.96),rgba(248,241,255,0.94),rgba(255,247,240,0.94))]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="section-label text-xs uppercase tracking-[0.28em]">one more little moment</p>

        <button
          type="button"
          onClick={handleOpen}
          disabled={phase !== 'sealed'}
          className="relative mt-10 flex h-[18.5rem] w-[18.5rem] items-center justify-center disabled:cursor-default"
          aria-label="Open the magical gift box"
        >
          {[...Array(10)].map((_, index) => (
            <motion.span
              key={index}
              animate={{ y: [0, -10, 0], opacity: [0.2, 0.95, 0.3], scale: [0.8, 1.15, 0.9] }}
              transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, delay: index * 0.18 }}
              className="absolute rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.9)]"
              style={{
                width: `${8 + (index % 3) * 4}px`,
                height: `${8 + (index % 3) * 4}px`,
                left: `${15 + ((index * 11) % 68)}%`,
                top: `${8 + ((index * 17) % 72)}%`,
              }}
            />
          ))}

          <motion.div
            animate={
              isOpened
                ? { rotate: 0 }
                : isOpening
                  ? { rotate: [0, -4, 4, -1], scale: [1, 1.02, 1] }
                  : { rotate: [0, -2, 2, 0] }
            }
            transition={
              isOpened
                ? { duration: 0.45 }
                : isOpening
                  ? { duration: 0.7, repeat: 2 }
                  : { duration: 2.6, repeat: Number.POSITIVE_INFINITY }
            }
            className="absolute bottom-[3.45rem] h-32 w-[13.8rem] rounded-[2rem] bg-[linear-gradient(145deg,#ffbfd8,#ff8fbe)] shadow-[0_22px_44px_rgba(241,150,191,0.34)]"
          >
            <div className="absolute inset-x-[43%] top-0 h-full w-6 rounded-full bg-[linear-gradient(180deg,#ffd98b,#ffefcf)]" />
            <div className="absolute inset-y-[44%] left-0 right-0 h-5 bg-[linear-gradient(90deg,#ffe3a5,#fff2d3)]" />
          </motion.div>

          <motion.div
            animate={
              isOpened
                ? { y: -58, rotate: -14, x: 5 }
                : isOpening
                  ? { y: [-6, -16, -32], rotate: [-2, -7, -11], x: [0, 2, 5] }
                  : { y: [0, -4, 0], rotate: [0, 1, 0] }
            }
            transition={
              isOpened
                ? { duration: 0.6, ease: 'easeOut' }
                : isOpening
                  ? { duration: 1.25, ease: 'easeOut' }
                  : { duration: 2.4, repeat: Number.POSITIVE_INFINITY }
            }
            className="absolute top-[2.4rem] h-20 w-[15.2rem] rounded-[1.9rem] bg-[linear-gradient(145deg,#ffc5dc,#ff98c3)] shadow-[0_18px_34px_rgba(241,150,191,0.28)]"
          >
            <div className="absolute inset-x-[43%] top-0 h-full w-6 rounded-full bg-[linear-gradient(180deg,#ffd98b,#ffefcf)]" />
            <div className="absolute inset-y-[42%] left-0 right-0 h-5 bg-[linear-gradient(90deg,#ffe3a5,#fff2d3)]" />
          </motion.div>

          <motion.div
            initial={false}
            animate={
              isOpened
                ? { opacity: 1, scale: 1, y: -26 }
                : isOpening
                  ? { opacity: [0, 0.65, 0.95], scale: [0.7, 0.9, 1], y: [-6, -14, -22] }
                  : { opacity: 0, scale: 0.8, y: 0 }
            }
            className="absolute top-6 flex flex-col items-center"
          >
            <div className="glass-chip flex h-16 w-16 items-center justify-center rounded-full bg-white/88 text-rose-400">
              <Gift size={26} />
            </div>
          </motion.div>
        </button>

        {phase === 'sealed' ? (
          <div className="mt-7 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[rgba(93,79,109,0.6)]">
            <Sparkles size={16} className="text-rose-300" />
            tap the gift and see what it is hiding
          </div>
        ) : isOpening ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 w-full max-w-xl"
          >
            <p className="section-title !text-[clamp(2.2rem,5vw,3.5rem)]">Unwrapping a tiny pocket of sweetness...</p>
            <p className="section-copy mx-auto mt-3 text-center">
              Just a second. This little box is gathering one soft note, one warm hug, and a little birthday magic.
            </p>
            <div className="glass-card mt-6 rounded-full p-2">
              <div className="h-3 overflow-hidden rounded-full bg-white/55">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#ffd6e7,#dac9ff,#ffe6d3)]"
                  initial={{ width: '18%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.65, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl"
          >
            <p className="section-title !text-[clamp(2.4rem,6vw,4rem)]">Some people become memories. Some become magic 💖</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {['A soft note 💌', 'A pocket hug 🤗', 'Birthday magic ✨'].map((item) => (
                <span key={item} className="glass-chip rounded-full px-4 py-2 text-sm font-bold text-[var(--ink)]">
                  {item}
                </span>
              ))}
            </div>
            <p className="section-copy mx-auto mt-4 text-center">
              Inside this little box: a sweet note, a tiny hug, and the key to the rest of the birthday surprise.
            </p>
            <button type="button" onClick={onContinue} className="magic-button mt-8">
              Unwrap the rest
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
