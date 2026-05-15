import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, RotateCcw, Sparkles, Target } from 'lucide-react'
import { createId } from '../utils/helpers'

const defaultNote =
  'BAJAO JAB TAK KHUSH NA HO JAO'

const reactionLabels = [
  'bonk!',
  'soft slap',
  '+1 smile',
  'hehe',
  'mood up',
  'cute revenge',
]

const milestoneNotes = [
  'That is already enough to bully one bad mood.',
  'Sadness is losing badly. Keep going.',
  'This officially counts as emotional first aid.',
  'Maximum cheer-up energy achieved.',
]

function getMoodLabel(score) {
  if (score >= 60) {
    return 'Bhai ab tak mood theek nahi hua kya 👉👈😭'
  }

  if (score >= 40) {
    return 'full sunshine mode aur mere gaal full laal 😊'
  }

  if (score >= 25) {
    return 'sadness gone par ab to rukja please'
  }

  if (score >= 10) {
    return 'kaafi maza aaya'
  }

  if (score >= 1) {
    return 'halka sa maza aaya'
  }

  return 'To chalie shuru karte hain iski gandi si shakal ko aur bigadna'
}

export default function CheerUpSlapGame({ photoSrc = '', onTap }) {
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [bursts, setBursts] = useState([])
  const [slapFlashes, setSlapFlashes] = useState([])
  const [impactToken, setImpactToken] = useState(0)
  const [photoError, setPhotoError] = useState(false)
  const [note, setNote] = useState(defaultNote)

  const moodLabel = useMemo(() => getMoodLabel(score), [score])
  const hasPhoto = Boolean(photoSrc) && !photoError

  const handleTap = (event) => {
    onTap?.()

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const nextScore = score + 1
    const burstId = createId()
    const slapId = createId()

    setScore(nextScore)
    setBestScore((current) => Math.max(current, nextScore))
    setImpactToken((current) => current + 1)
    setBursts((current) => [
      ...current.slice(-7),
      {
        id: burstId,
        x,
        y,
        label: reactionLabels[(nextScore - 1) % reactionLabels.length],
      },
    ])
    setSlapFlashes((current) => [
      ...current.slice(-2),
      {
        id: slapId,
        x: Math.min(x + 14, 88),
        y: Math.max(y - 8, 14),
      },
    ])

    window.setTimeout(() => {
      setBursts((current) => current.filter((burst) => burst.id !== burstId))
    }, 680)

    window.setTimeout(() => {
      setSlapFlashes((current) => current.filter((slap) => slap.id !== slapId))
    }, 380)

    if (nextScore % 10 === 0) {
      setNote(milestoneNotes[((nextScore / 10) - 1) % milestoneNotes.length])
      return
    }

    if (nextScore === 1) {
      setNote('There you go. One tiny slap closer to a better mood.')
    }
  }

  const resetGame = () => {
    setScore(0)
    setBursts([])
    setSlapFlashes([])
    setImpactToken(0)
    setNote(defaultNote)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
      <div>
        <p className="section-label text-xs uppercase tracking-[0.24em]">sad day rescue game</p>
        <h2 className="section-title !mt-5 !text-[clamp(2.6rem,6vw,4.3rem)]">
          Tap my face until the mood gets better
        </h2>
        <p className="section-copy">
          Whenever you feel sad, this little game is here for emergency support. Tap away,
          collect cheer points, and let the bad mood get roasted a little.
        </p>

        <div className="glass-card mt-8 rounded-[1.8rem] p-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/72 px-4 py-2 text-sm font-bold text-[var(--ink)]">
            <Sparkles size={16} className="text-rose-400" />
            Jitna marzi bajao
          </div>
          <p className="mt-4 text-sm leading-7 text-[rgba(93,79,109,0.78)]">{note}</p>
        </div>

        {!hasPhoto ? (
          <p className="mt-4 text-sm font-semibold text-[rgba(93,79,109,0.64)]">
            Photo slot is ready. Add one local image to the cheer-up game asset folder and it
            will appear here automatically.
          </p>
        ) : null}
      </div>

      <div className="glass-card relative overflow-hidden rounded-[2rem] p-5 sm:p-6">
        <div className="absolute inset-0 sparkle-mist opacity-50" />

        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
          <motion.button
            type="button"
            onClick={handleTap}
            whileTap={{ scale: 0.985 }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[21rem] overflow-hidden rounded-[1.9rem] border border-white/65 bg-[linear-gradient(180deg,rgba(255,248,252,0.92),rgba(244,234,255,0.86))] text-left shadow-[0_22px_44px_rgba(178,145,202,0.18)]"
            aria-label="Tap the photo to earn cheer points"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_42%),linear-gradient(180deg,rgba(255,247,251,0.65),rgba(234,223,255,0.32))]" />

            <motion.div
              key={impactToken}
              initial={{ x: 0, rotate: 0, scale: 1 }}
              animate={{ x: [0, -10, 10, -6, 0], rotate: [0, -2, 2, -1, 0], scale: [1, 0.98, 1.02, 1] }}
              transition={{ duration: 0.36, ease: 'easeOut' }}
              className="relative h-full w-full"
            >
              {hasPhoto ? (
                <img
                  src={photoSrc}
                  alt="Tap target"
                  className="h-full w-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <div className="glass-chip inline-flex h-20 w-20 items-center justify-center rounded-full text-rose-400">
                    <Heart size={30} fill="currentColor" />
                  </div>
                  <p className="text-xl font-extrabold text-[var(--ink-strong)]">Your photo slot is ready</p>
                  <p className="max-w-xs text-sm leading-7 text-[rgba(93,79,109,0.72)]">
                    The game is already live. Drop in one local image and this placeholder will
                    quietly step aside.
                  </p>
                </div>
              )}
            </motion.div>

            <AnimatePresence>
              {bursts.map((burst) => (
                <motion.span
                  key={burst.id}
                  initial={{ opacity: 0, y: 10, scale: 0.7 }}
                  animate={{ opacity: 1, y: -14, scale: 1 }}
                  exit={{ opacity: 0, y: -26, scale: 0.92 }}
                  className="pointer-events-none absolute z-20 rounded-full bg-white/86 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-strong)] shadow-[0_14px_26px_rgba(177,145,202,0.22)] backdrop-blur-xl"
                  style={{
                    left: `${burst.x}%`,
                    top: `${burst.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {burst.label}
                </motion.span>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {slapFlashes.map((slap) => (
                <motion.span
                  key={slap.id}
                  initial={{ opacity: 0, x: 28, y: -4, rotate: 18, scale: 0.75 }}
                  animate={{ opacity: [0, 1, 1, 0], x: [28, 2, -8, -14], y: [-4, 0, 4, 8], rotate: [18, 4, -8, -14], scale: [0.75, 1, 1, 0.92] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  className="pointer-events-none absolute z-20 rounded-full bg-[linear-gradient(135deg,rgba(255,240,246,0.96),rgba(243,233,255,0.94))] px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[var(--ink-strong)] shadow-[0_16px_26px_rgba(176,143,201,0.24)]"
                  style={{
                    left: `${slap.x}%`,
                    top: `${slap.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  slap
                </motion.span>
              ))}
            </AnimatePresence>

            <div className="absolute inset-x-4 bottom-4 rounded-full bg-white/80 px-4 py-3 text-center text-sm font-semibold text-[rgba(93,79,109,0.74)] backdrop-blur-xl">
              tap my face and steal your smile back
            </div>
          </motion.button>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="glass-chip rounded-[1.4rem] p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[rgba(93,79,109,0.54)]">
                <Target size={14} className="text-violet-400" />
                cheer points
              </div>
              <p className="mt-2 text-2xl font-extrabold text-[var(--ink-strong)]">{score}</p>
            </div>

            <div className="glass-chip rounded-[1.4rem] p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[rgba(93,79,109,0.54)]">
                <Heart size={14} className="text-rose-400" />
                best score
              </div>
              <p className="mt-2 text-2xl font-extrabold text-[var(--ink-strong)]">{bestScore}</p>
            </div>

            <div className="glass-chip rounded-[1.4rem] p-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[rgba(93,79,109,0.54)]">
                <Sparkles size={14} className="text-amber-400" />
                mood now
              </div>
              <p className="mt-2 text-base font-extrabold text-[var(--ink-strong)]">{moodLabel}</p>
            </div>

            <button type="button" onClick={resetGame} className="secondary-button justify-center">
              <RotateCcw size={16} />
              Reset score
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
