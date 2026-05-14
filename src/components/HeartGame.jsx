import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { Clock3, Heart, RotateCcw, Sparkles, Target } from 'lucide-react'
import { createId } from '../utils/helpers'
import { useWindowSize } from '../hooks/useWindowSize'

const GAME_DURATION = 20
const MOBILE_BREAKPOINT = 768
const MOBILE_TARGET_SCORE = 40
const DESKTOP_TARGET_SCORE = 10
const MOBILE_HEART_SETTINGS = {
  spawnInterval: 220,
  maxVisibleHearts: 18,
  durationBase: 4.4,
  durationVariance: 1.4,
}
const DESKTOP_HEART_SETTINGS = {
  spawnInterval: 460,
  maxVisibleHearts: 10,
  durationBase: 4.6,
  durationVariance: 1.8,
}

export default function HeartGame({ onWin }) {
  const [status, setStatus] = useState('ready')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [hearts, setHearts] = useState([])
  const [bursts, setBursts] = useState([])
  const completionRef = useRef(false)
  const scoreRef = useRef(0)
  const { width, height } = useWindowSize()
  const responsiveTargetScore =
    width < MOBILE_BREAKPOINT ? MOBILE_TARGET_SCORE : DESKTOP_TARGET_SCORE
  const responsiveHeartSettings =
    width < MOBILE_BREAKPOINT ? MOBILE_HEART_SETTINGS : DESKTOP_HEART_SETTINGS
  const [targetScore, setTargetScore] = useState(responsiveTargetScore)
  const [heartSettings, setHeartSettings] = useState(responsiveHeartSettings)

  const finishGame = useCallback(
    (didWin) => {
      setStatus('finished')
      if (didWin && !completionRef.current) {
        completionRef.current = true
        onWin?.()
      }
    },
    [onWin],
  )

  useEffect(() => {
    if (status !== 'playing') {
      return undefined
    }

    const spawn = window.setInterval(() => {
      setHearts((current) => [
        ...current.slice(-(heartSettings.maxVisibleHearts - 1)),
        {
          id: createId(),
          left: 8 + Math.random() * 80,
          size: 24 + Math.random() * 18,
          duration: heartSettings.durationBase + Math.random() * heartSettings.durationVariance,
          drift: -42 + Math.random() * 84,
          travel: 420 + Math.random() * 120,
          hue: Math.random() > 0.5 ? 'text-rose-400' : 'text-fuchsia-300',
        },
      ])
    }, heartSettings.spawnInterval)

    return () => window.clearInterval(spawn)
  }, [heartSettings, status])

  useEffect(() => {
    if (status === 'playing') {
      return
    }

    setTargetScore(responsiveTargetScore)
    setHeartSettings(responsiveHeartSettings)
  }, [responsiveHeartSettings, responsiveTargetScore, status])

  useEffect(() => {
    if (status !== 'playing') {
      return undefined
    }

    const timer = window.setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0)
        finishGame(scoreRef.current >= targetScore)
        return
      }

      setTimeLeft((current) => current - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [finishGame, status, targetScore, timeLeft])

  const startGame = () => {
    setTargetScore(responsiveTargetScore)
    setHeartSettings(responsiveHeartSettings)
    completionRef.current = false
    scoreRef.current = 0
    setStatus('playing')
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setHearts([])
    setBursts([])
  }

  const collectHeart = (heartId, left) => {
    if (status !== 'playing') {
      return
    }

    setHearts((current) => current.filter((heart) => heart.id !== heartId))
    const nextScore = scoreRef.current + 1
    scoreRef.current = nextScore
    setScore(nextScore)
    const burstId = createId()
    setBursts((current) => [...current, { id: burstId, left }])
    window.setTimeout(() => {
      setBursts((current) => current.filter((burst) => burst.id !== burstId))
    }, 500)

    if (nextScore >= targetScore) {
      finishGame(true)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem]">
      {status === 'finished' && score >= targetScore ? (
        <Confetti
          recycle={false}
          numberOfPieces={180}
          width={width}
          height={Math.min(height, 720)}
          className="pointer-events-none !fixed inset-0 z-20"
        />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-xs uppercase tracking-[0.22em]">heart catch</p>
          <h3 className="section-title !mt-5 !text-[clamp(2.2rem,5vw,3.6rem)]">Catch as many hearts as you can</h3>
          <p className="section-copy">
            Tap the floating hearts before they drift away. Reach {targetScore} to win the full reveal.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="glass-chip flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-[var(--ink)]">
            <Target size={16} className="text-violet-400" />
            score {score}
          </div>
          <div className="glass-chip flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-[var(--ink)]">
            <Clock3 size={16} className="text-rose-400" />
            {timeLeft}s
          </div>
        </div>
      </div>

      <div className="glass-card relative mt-6 h-[25rem] overflow-hidden rounded-[2rem] p-4">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,251,0.9),rgba(244,235,255,0.7))]" />
        <div className="absolute inset-0 sparkle-mist opacity-60" />

        <AnimateHearts hearts={hearts} onCollect={collectHeart} setHearts={setHearts} />
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: 1, scale: 1.1, y: -22 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute top-1/2 z-20 flex gap-1 text-lg"
            style={{ left: `${burst.left}%` }}
          >
            <span>✨</span>
            <span>💖</span>
            <span>✨</span>
          </motion.div>
        ))}

        <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between">
          <div className="flex justify-between text-xs font-extrabold uppercase tracking-[0.22em] text-[rgba(93,79,109,0.55)]">
            <span>tap quickly</span>
            <span>goal: {targetScore}</span>
          </div>

          <div className={`mx-auto flex max-w-md flex-col items-center text-center ${status !== 'playing' ? 'pointer-events-auto' : ''}`}>
            {status === 'ready' ? (
              <>
                <div className="glass-chip mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-rose-400">
                  <Heart size={26} fill="currentColor" />
                </div>
                <p className="text-lg font-extrabold text-[var(--ink-strong)]">Ready to catch a tiny storm of hearts?</p>
                <button type="button" onClick={startGame} className="magic-button mt-5">
                  Start catching
                </button>
              </>
            ) : status === 'finished' ? (
              <>
                <div className="glass-chip mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full text-violet-400">
                  <Sparkles size={26} />
                </div>
                <p className="text-[1.55rem] font-extrabold text-[var(--ink-strong)]">
                  {score >= targetScore ? 'You caught my heart too 💖' : 'Almost had it, pretty close though'}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[rgba(93,79,109,0.72)]">
                  {score >= targetScore
                    ? 'That was officially adorable. The hearts agree.'
                    : 'One more round and the sky is yours. The replay button is ready.'}
                </p>
                <button type="button" onClick={startGame} className="secondary-button mt-5">
                  <RotateCcw size={16} />
                  Play again
                </button>
              </>
            ) : (
              <p className="glass-chip rounded-full px-4 py-2 text-sm font-bold text-[rgba(93,79,109,0.72)]">
                Tap the hearts
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimateHearts({ hearts, onCollect, setHearts }) {
  return hearts.map((heart) => (
    <motion.button
      key={heart.id}
      type="button"
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.75 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        y: -heart.travel,
        x: [0, heart.drift, heart.drift * 0.35],
        scale: [0.75, 1.08, 1.02],
      }}
      transition={{ duration: heart.duration, ease: 'linear' }}
      onClick={() => onCollect(heart.id, heart.left)}
      onAnimationComplete={() => {
        setHearts((current) => current.filter((item) => item.id !== heart.id))
      }}
      className={`absolute bottom-[-3.5rem] z-30 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-white/22 ring-1 ring-white/35 backdrop-blur-[2px] ${heart.hue}`}
      style={{ left: `${heart.left}%` }}
      aria-label="Collect heart"
    >
      <Heart size={heart.size} fill="currentColor" className="drop-shadow-[0_0_18px_rgba(255,255,255,0.88)]" />
    </motion.button>
  ))
}
