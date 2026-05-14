import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { ArrowUpRight, CheckCircle2, Heart, LockKeyhole, Sparkles, Stars } from 'lucide-react'
import { useWindowSize } from '../hooks/useWindowSize'

export default function FinalReveal({
  isUnlocked,
  revealed,
  onReveal,
  onOpenFinalMessage,
  checklist = [],
  onShowUnlockPath,
}) {
  const { width, height } = useWindowSize()

  return (
    <div className="relative overflow-hidden rounded-[2.4rem] px-5 py-8 sm:px-8 sm:py-10">
      {revealed ? (
        <Confetti
          recycle={false}
          numberOfPieces={260}
          width={width}
          height={Math.min(height, 860)}
          className="pointer-events-none !fixed inset-0 z-20"
        />
      ) : null}

      <div className="absolute inset-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),transparent_30%),linear-gradient(180deg,rgba(255,236,247,0.96),rgba(243,236,255,0.94),rgba(255,244,236,0.96))]" />
      <div className="absolute inset-0 sparkle-mist opacity-70" />

      {revealed ? (
        [...Array(14)].map((_, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0.2, 1, 0.4], y: [0, -32, -12], x: [0, (index % 2 === 0 ? -18 : 18), 0], scale: [0.6, 1.1, 0.9] }}
            transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, delay: index * 0.12 }}
            className="absolute z-10 text-[1.35rem]"
            style={{
              left: `${10 + ((index * 7) % 78)}%`,
              top: `${16 + ((index * 9) % 66)}%`,
            }}
          >
            {index % 2 === 0 ? '💖' : '✨'}
          </motion.span>
        ))
      ) : null}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="section-label text-xs uppercase tracking-[0.24em]">
          {isUnlocked ? 'grand reveal unlocked' : 'grand reveal locked'}
        </p>

        {!isUnlocked ? (
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="glass-card rounded-[2rem] px-6 py-8">
              <div className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white/76 text-violet-400">
                <LockKeyhole size={30} />
              </div>
              <h3 className="mt-5 text-[2rem] font-extrabold text-[var(--ink-strong)]">A little more magic first</h3>
              <p className="mt-3 text-sm leading-7 text-[rgba(93,79,109,0.74)]">
                Explore the sections above, unlock the wish sky, and visit the surprises. The finale opens when the story feels complete enough.
              </p>

              <div className="mt-6 grid gap-3 text-left">
                {checklist.map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] bg-white/62 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                        {item.done ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <LockKeyhole size={15} className="text-violet-400" />
                        )}
                        {item.label}
                      </div>
                      <span className={`text-xs font-extrabold uppercase tracking-[0.18em] ${item.done ? 'text-emerald-600' : 'text-[rgba(93,79,109,0.48)]'}`}>
                        {item.done ? 'done' : 'pending'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[rgba(93,79,109,0.68)]">{item.hint}</p>
                  </div>
                ))}
              </div>

              <button type="button" onClick={onShowUnlockPath} className="magic-button mt-6">
                Show me what to do next
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        ) : !revealed ? (
          <div className="mx-auto mt-8 max-w-3xl">
            <h2 className="section-title !text-[clamp(3rem,8vw,5.2rem)]">The final birthday moment is ready</h2>
            <p className="section-copy mx-auto mt-3 text-center">
              One tap and the whole page turns into the grand reveal.
            </p>
            <button type="button" onClick={onReveal} className="magic-button mt-8">
              Light up the finale
              <Stars size={18} />
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-4xl">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/78 px-4 py-2 text-sm font-bold text-[var(--ink)]">
              <Sparkles size={16} className="text-amber-400" />
              the birthday sky is officially glowing
            </div>
            <h2 className="section-title !mt-8 !text-[clamp(3.5rem,10vw,6.5rem)]">HAPPY BIRTHDAY VIDUSHI 🎂💖✨</h2>
            <p className="section-copy mx-auto mt-4 text-center text-[1.08rem] sm:text-[1.18rem]">
              May your life stay as beautiful as your smile 💖
            </p>

            <div className="mt-8 flex justify-center">
              <button type="button" onClick={onOpenFinalMessage} className="magic-button">
                One Last Surprise...
                <Heart size={18} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
