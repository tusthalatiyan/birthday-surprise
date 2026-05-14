import { motion } from 'framer-motion'
import {
  BadgeCheck,
  Disc3,
  Gamepad2,
  LockKeyhole,
  Mail,
  Sparkles,
  Stars,
  Unlock,
} from 'lucide-react'

const choices = [
  {
    id: 'letter',
    title: 'Open a secret letter 💌',
    description: 'An envelope opens into a long, elegant birthday note.',
    icon: Mail,
  },
  {
    id: 'hearts',
    title: 'Catch hearts 💖',
    description: 'A tiny game where every tap feels a little flirty and fun.',
    icon: Gamepad2,
  },
  {
    id: 'wheel',
    title: 'Spin surprise wheel 🎡',
    description: 'A proper spinning wheel with cute outcomes and a result popup.',
    icon: Disc3,
  },
  {
    id: 'wish',
    title: 'Make a wish 🌠',
    description: 'Tap the sky until it glows her name back to her.',
    icon: Stars,
  },
]

export default function SurpriseChoices({ onSelect, visited, vaultUnlocked, onVaultOpen }) {
  return (
    <div>
      <p className="section-label text-xs uppercase tracking-[0.24em]">choose your surprise</p>
      <h2 className="section-title !mt-5 !text-[clamp(2.6rem,6vw,4.3rem)]">Pick the next little magic moment</h2>
      <p className="section-copy">
        Each card opens a different mini experience. Take them in any order you want.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {choices.map((choice, index) => {
          const Icon = choice.icon
          const seen = visited.includes(choice.id)

          return (
            <motion.button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice.id)}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card relative overflow-hidden rounded-[1.9rem] p-5 text-left sm:p-6"
            >
              <div className="absolute right-5 top-5 rounded-full bg-white/80 p-3 text-violet-400 shadow-sm">
                <Icon size={20} />
              </div>

              <span className="section-label !px-3 !py-2 text-[0.68rem] uppercase tracking-[0.18em]">
                surprise {index + 1}
              </span>
              <h3 className="mt-4 max-w-[16rem] text-[1.45rem] font-extrabold leading-tight text-[var(--ink-strong)]">
                {choice.title}
              </h3>
              <p className="mt-3 max-w-[28rem] text-sm leading-7 text-[rgba(93,79,109,0.74)]">{choice.description}</p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[rgba(93,79,109,0.66)]">
                {seen ? <BadgeCheck size={16} className="text-emerald-500" /> : <Sparkles size={16} className="text-rose-400" />}
                {seen ? 'already visited, tap to reopen' : 'tap to open'}
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        type="button"
        onClick={onVaultOpen}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-5 w-full rounded-[1.9rem] border px-5 py-5 text-left shadow-[0_18px_34px_rgba(181,152,206,0.16)] backdrop-blur-xl ${
          vaultUnlocked
            ? 'border-white/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(248,236,255,0.72))]'
            : 'border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(245,240,255,0.42))] opacity-80'
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="section-label !px-3 !py-2 text-[0.68rem] uppercase tracking-[0.18em]">
              bonus vault
            </div>
            <h3 className="mt-3 text-[1.35rem] font-extrabold text-[var(--ink-strong)]">
              {vaultUnlocked ? 'Unlocked surprise path 💫' : 'Locked for now... tap me for directions'}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[rgba(93,79,109,0.74)]">
              {vaultUnlocked
                ? 'The secret hunt woke this up. Tap here to jump straight to the grand finale section.'
                : 'A fake little lock, for the drama. Tap here and it will take you straight to the secret hunt section.'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--ink)]">
            {vaultUnlocked ? <Unlock size={18} className="text-emerald-500" /> : <LockKeyhole size={18} className="text-violet-400" />}
            {vaultUnlocked ? 'Now open' : 'Show me'}
          </div>
        </div>
      </motion.button>
    </div>
  )
}
