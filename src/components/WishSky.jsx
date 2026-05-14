import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Stars } from 'lucide-react'
import { constellationNodes, constellationPaths } from '../utils/constellation'
import { createId } from '../utils/helpers'

const REQUIRED_TAPS = 8

export default function WishSky({ onComplete }) {
  const [stars, setStars] = useState([])
  const [constellationReady, setConstellationReady] = useState(false)
  const skyRef = useRef(null)
  const completedRef = useRef(false)

  const ambientStars = useMemo(
    () =>
      [...Array(24)].map((_, index) => ({
        id: index,
        left: `${4 + ((index * 17) % 92)}%`,
        top: `${6 + ((index * 11) % 78)}%`,
        size: 2 + (index % 3) * 2,
        delay: index * 0.18,
      })),
    [],
  )

  const addStar = (left, top) => {
    const nextStars = [...stars, { id: createId(), left, top }]
    setStars(nextStars)

    if (nextStars.length >= REQUIRED_TAPS && !completedRef.current) {
      completedRef.current = true
      setConstellationReady(true)
      onComplete?.()
    }
  }

  const handleSkyTap = (event) => {
    const rect = skyRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const left = ((event.clientX - rect.left) / rect.width) * 100
    const top = ((event.clientY - rect.top) / rect.height) * 100
    addStar(left, top)
  }

  const handleKeyDrop = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    addStar(50 + Math.random() * 12 - 6, 45 + Math.random() * 16 - 8)
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-xs uppercase tracking-[0.22em]">wish sky</p>
          <h3 className="section-title !mt-5 !text-[clamp(2.2rem,5vw,3.6rem)]">Touch the night and make a wish</h3>
          <p className="section-copy">
            Every tap leaves a star behind. After enough wishes, the sky writes VIDUSHI back in constellations.(Maango bachcha maango sab milega)
          </p>
        </div>
        <div className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-black/70">
          <Stars size={16} className="text-sky-300" />
          {Math.min(stars.length, REQUIRED_TAPS)}/{REQUIRED_TAPS} wishes placed
        </div>
      </div>

      <div
        ref={skyRef}
        onClick={handleSkyTap}
        onKeyDown={handleKeyDrop}
        role="button"
        tabIndex={0}
        className="wish-sky relative mt-6 h-[27rem] overflow-hidden rounded-[2rem] p-4 outline-none sm:h-[31rem]"
        aria-label="Tap the wish sky to create stars"
      >
        {ambientStars.map((star) => (
          <motion.span
            key={star.id}
            animate={{ opacity: [0.3, 1, 0.4], scale: [0.8, 1.1, 0.9] }}
            transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, delay: star.delay }}
            className="absolute rounded-full bg-white/90 shadow-[0_0_14px_rgba(255,255,255,0.85)]"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          />
        ))}

        {stars.map((star) => (
          <motion.span
            key={star.id}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-10 h-3 w-3 rounded-full bg-sky-100 shadow-[0_0_22px_rgba(213,244,255,0.95)]"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
          />
        ))}

        {constellationReady ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10">
            <svg viewBox="0 0 960 220" className="absolute left-[6%] right-[6%] top-[24%] w-[88%]">
              {constellationPaths.map((path) => (
                <motion.path
                  key={path}
                  d={path}
                  className="constellation-path"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8 }}
                />
              ))}
              {constellationNodes.map((node, index) => (
                <motion.circle
                  key={`${node.x}-${node.y}`}
                  cx={node.x}
                  cy={node.y}
                  r="6"
                  fill="rgba(220,247,255,0.98)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  style={{ filter: 'drop-shadow(0 0 14px rgba(197, 244, 255, 0.8))' }}
                />
              ))}
            </svg>
          </motion.div>
        ) : null}

        <div className="absolute bottom-5 left-5 right-5 z-20 rounded-[1.4rem] bg-[rgba(18,16,43,0.42)] p-4 text-white/90 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Sparkles size={16} className="text-sky-200" />
            {constellationReady ? 'The sky learned her name' : 'Tap anywhere in the sky'}
          </div>
          <p className="mt-2 text-sm leading-7 text-white/72">
            {constellationReady
              ? 'VIDUSHI has appeared in glowing stars. It is dramatic, a little emotional, and fully deserved.'
              : 'Keep adding stars until the constellation decides to reveal itself.'}
          </p>
        </div>
      </div>
    </div>
  )
}
