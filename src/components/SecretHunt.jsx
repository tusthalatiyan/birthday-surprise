import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Heart, LockKeyhole, MoonStar, Star } from 'lucide-react'

const huntItems = [
  { id: 'heart', label: 'heart', icon: Heart, left: '10%', top: '24%' },
  { id: 'moon', label: 'moon', icon: MoonStar, left: '76%', top: '18%' },
  { id: 'teddy', label: 'teddy', emoji: '🧸', left: '22%', top: '72%' },
  { id: 'butterfly', label: 'butterfly', emoji: '🦋', left: '58%', top: '54%' },
  { id: 'star', label: 'star', icon: Star, left: '82%', top: '72%' },
]

export default function SecretHunt({ messages, onFound, onComplete }) {
  const [found, setFound] = useState([])
  const allFound = found.length === huntItems.length

  const progress = useMemo(() => (found.length / huntItems.length) * 100, [found.length])

  const handleFind = (itemId) => {
    if (found.includes(itemId)) {
      return
    }

    const nextFound = [...found, itemId]
    setFound(nextFound)
    onFound?.(itemId, messages[itemId === 'moon' ? 'moon' : itemId], nextFound.length)

    if (nextFound.length === huntItems.length) {
      onComplete?.()
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
      <div>
        <p className="section-label text-xs uppercase tracking-[0.24em]">secret hunt game</p>
        <h2 className="section-title !mt-5 !text-[clamp(2.6rem,6vw,4.3rem)]">Find every hidden little thing</h2>
        <p className="section-copy">
          Heart, moon, teddy, butterfly, and star. Each one hides a sweet message. Find them all to unlock a bonus surprise.
        </p>

        <div className="glass-card mt-8 rounded-[1.8rem] p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[rgba(93,79,109,0.56)]">progress</p>
            <p className="text-sm font-extrabold text-[var(--ink-strong)]">{found.length}/5 found</p>
          </div>
          <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/55">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#ffd6e7,#e6dcff,#dff2ff)]"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {huntItems.map((item) => (
              <span
                key={item.id}
                className={`rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] ${
                  found.includes(item.id)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-white/68 text-[rgba(93,79,109,0.55)]'
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card relative h-[27rem] overflow-hidden rounded-[2rem] p-4 sm:h-[31rem]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,253,255,0.3),rgba(228,216,255,0.18)),linear-gradient(180deg,rgba(255,245,249,0.9),rgba(244,238,255,0.86))]" />
        <div className="absolute inset-0 sparkle-mist opacity-55" />

        {huntItems.map((item, index) => {
          const Icon = item.icon
          const foundItem = found.includes(item.id)

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => handleFind(item.id)}
              whileHover={{ scale: 1.15, rotate: index % 2 === 0 ? 8 : -8 }}
              whileTap={{ scale: 0.92 }}
              aria-label={`Find the hidden ${item.label}`}
              className={`absolute z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/76 text-[var(--ink-strong)] shadow-[0_14px_26px_rgba(176,145,201,0.18)] transition ${
                foundItem ? 'ring-2 ring-emerald-300/70' : ''
              }`}
              style={{ left: item.left, top: item.top }}
            >
              {Icon ? (
                <Icon size={22} className={foundItem ? 'text-emerald-500' : 'text-rose-400'} />
              ) : (
                <span className="text-2xl">{item.emoji}</span>
              )}
            </motion.button>
          )
        })}

        <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] bg-white/75 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-[rgba(93,79,109,0.74)]">
            {allFound ? <CheckCircle2 size={16} className="text-emerald-500" /> : <LockKeyhole size={16} className="text-violet-400" />}
            {allFound ? 'Bonus surprise unlocked' : 'Find them all to unlock the mystery vault'}
          </div>
          <p className="mt-2 text-sm leading-6 text-[rgba(93,79,109,0.66)]">
            {allFound
              ? 'The locked surprise card later in the journey is awake now.'
              : 'They are all hiding in plain sight. Tap gently and keep exploring.'}
          </p>
        </div>

        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="twinkle-star absolute rounded-full bg-white/85 shadow-[0_0_12px_rgba(255,255,255,0.85)]"
            style={{
              width: `${4 + (index % 3) * 3}px`,
              height: `${4 + (index % 3) * 3}px`,
              left: `${8 + ((index * 11) % 84)}%`,
              top: `${10 + ((index * 15) % 72)}%`,
              animationDelay: `${index * 0.22}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
