import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MailOpen, Sparkles } from 'lucide-react'

export default function SecretLetter({ letter }) {
  const [opened, setOpened] = useState(false)

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-xs uppercase tracking-[0.22em]">secret letter</p>
          <h3 className="section-title !mt-5 !text-[clamp(2.2rem,5vw,3.6rem)]">An envelope full of birthday softness</h3>
          <p className="section-copy">
            Tap the envelope to open it.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <button
          type="button"
          onClick={() => setOpened(true)}
          className="glass-card relative flex h-[22rem] items-center justify-center overflow-hidden rounded-[2rem] p-6 text-left"
          aria-label="Open secret letter"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,245,248,0.94),rgba(247,240,255,0.86))]" />
          <div className="absolute inset-0 sparkle-mist opacity-55" />
          <div className="relative z-10 w-full max-w-md">
            <motion.div
              animate={opened ? { y: -22, rotateX: -24 } : { y: [0, -4, 0] }}
              transition={opened ? { duration: 0.6 } : { duration: 2.3, repeat: Number.POSITIVE_INFINITY }}
              className="mx-auto h-40 w-full rounded-[1.8rem] bg-[linear-gradient(145deg,#ffc7df,#f3ddff)] shadow-[0_18px_34px_rgba(182,150,209,0.24)]"
            >
              <div className="absolute inset-x-0 top-[35%] mx-auto h-0 w-0 border-x-[9.2rem] border-b-0 border-t-[5.8rem] border-x-transparent border-t-white/70" />
              <div className="absolute left-1/2 top-[42%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/78 text-rose-400 shadow-sm">
                {opened ? <MailOpen size={22} /> : <Heart size={22} fill="currentColor" />}
              </div>
            </motion.div>
            <div className="mt-6 text-center">
              <p className="text-lg font-extrabold text-[var(--ink-strong)]">{opened ? 'Opened with extra tenderness' : 'Tap to open the envelope'}</p>
              <p className="mt-2 text-sm leading-7 text-[rgba(93,79,109,0.72)]">
                {opened
                  ? 'Khul gaya'
                  : 'Inside is a long birthday message waiting for you.'}
              </p>
            </div>
          </div>
        </button>

        <motion.article
          initial={false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="glass-card rounded-[2rem] p-6 sm:p-8"
        >
          {opened ? (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50/80 px-4 py-2 text-sm font-bold text-[var(--ink)]">
                <Sparkles size={16} className="text-rose-400" />
                {letter.greeting}
              </div>

              <div className="space-y-5">
                {letter.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="paper-text">
                    {paragraph}
                  </p>
                ))}
              </div>

              <p className="paper-text mt-6 font-bold italic">{letter.signoff}</p>
            </>
          ) : (
            <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
              <div className="glass-chip inline-flex h-16 w-16 items-center justify-center rounded-full text-rose-400">
                <Heart size={24} fill="currentColor" />
              </div>
              <h4 className="mt-5 text-[1.8rem] font-extrabold text-[var(--ink-strong)]">Still sealed, still shy</h4>
              <p className="mt-3 max-w-md text-sm leading-7 text-[rgba(93,79,109,0.72)]">
                Tap the envelope on the left and the birthday note will unfold right here like a soft little secret.
              </p>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  )
}
