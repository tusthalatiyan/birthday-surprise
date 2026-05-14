import { useCallback, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Disc3, Sparkles } from 'lucide-react'
import PopupMessage from './PopupMessage'

const colors = ['#ffd6e7', '#e6dcff', '#dff2ff', '#ffe3cf', '#f9d8f1', '#fff4d9']

function polarToCartesian(centerX, centerY, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians),
  }
}

function describeSector(startAngle, endAngle) {
  const start = polarToCartesian(150, 150, 140, endAngle)
  const end = polarToCartesian(150, 150, 140, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return [
    `M 150 150`,
    `L ${start.x} ${start.y}`,
    `A 140 140 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

export default function SpinWheel({ outcomes }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState(null)
  const spinBagRef = useRef([])
  const lastIndexRef = useRef(null)

  const sliceAngle = 360 / outcomes.length
  const favoriteIndices = useMemo(
    () =>
      outcomes
        .map((outcome, index) => ({ label: outcome.label, index }))
        .filter(
          ({ label }) => label.includes('Virtual Hug') || label.includes('Magic Kiss'),
        )
        .map(({ index }) => index),
    [outcomes],
  )

  const createSpinBag = useCallback(() => {
    const sourceIndices = favoriteIndices.length
      ? [...favoriteIndices]
      : outcomes.map((_, index) => index)
    const indices = [...sourceIndices]

    for (let index = indices.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1))
      ;[indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]]
    }

    if (
      lastIndexRef.current !== null &&
      indices.length > 1 &&
      indices[0] === lastIndexRef.current
    ) {
      ;[indices[0], indices[1]] = [indices[1], indices[0]]
    }

    return indices
  }, [favoriteIndices, outcomes])

  const sectorData = useMemo(
    () =>
      outcomes.map((outcome, index) => {
        const startAngle = index * sliceAngle
        const endAngle = startAngle + sliceAngle
        const labelAngle = startAngle + sliceAngle / 2
        const labelPosition = polarToCartesian(150, 150, 88, labelAngle)

        return {
          ...outcome,
          path: describeSector(startAngle, endAngle),
          fill: colors[index % colors.length],
          labelX: labelPosition.x,
          labelY: labelPosition.y,
          angle: labelAngle,
        }
      }),
    [outcomes, sliceAngle],
  )

  const spinWheel = () => {
    if (spinning) {
      return
    }

    if (!spinBagRef.current.length) {
      spinBagRef.current = createSpinBag()
    }

    const nextIndex = spinBagRef.current.shift()
    const centerAngle = nextIndex * sliceAngle + sliceAngle / 2
    const desiredRotation = (360 - centerAngle) % 360
    const currentRotation = ((rotation % 360) + 360) % 360
    const delta = (desiredRotation - currentRotation + 360) % 360
    const nextRotation = rotation + 360 * (5 + Math.floor(Math.random() * 3)) + delta

    setSpinning(true)
    setSelected(null)
    setRotation(nextRotation)
    lastIndexRef.current = nextIndex

    window.setTimeout(() => {
      setSelected(outcomes[nextIndex])
      setSpinning(false)
    }, 4600)
  }

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-xs uppercase tracking-[0.22em]">spin surprise wheel</p>
          <h3 className="section-title !mt-5 !text-[clamp(2.2rem,5vw,3.6rem)]">Let the wheel pick your cute surprise</h3>
          <p className="section-copy">
            Apni kismat aazmao
          </p>
          <p className="mt-3 text-sm font-semibold text-[rgba(93,79,109,0.68)]">
            Cute note: this wheel has exactly two love languages, so it will always stop on either Virtual Hug or Magic Kiss.
          </p>
        </div>
        <button type="button" onClick={spinWheel} disabled={spinning} className="magic-button disabled:opacity-60">
          {spinning ? 'Spinning...' : 'Spin the wheel'}
          <Disc3 size={18} />
        </button>
      </div>

      <div className="glass-card relative mt-6 grid gap-6 overflow-hidden rounded-[2rem] p-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div className="absolute inset-0 sparkle-mist opacity-45" />
        <div className="relative mx-auto flex w-full max-w-[22rem] items-center justify-center">
          <div className="absolute -top-1 left-1/2 z-20 h-0 w-0 -translate-x-1/2 border-x-[16px] border-b-[28px] border-x-transparent border-b-[var(--ink-strong)]" />
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4.6, ease: [0.18, 0.85, 0.22, 1] }}
            className="relative z-10 rounded-full"
          >
            <svg viewBox="0 0 300 300" className="h-[20rem] w-[20rem] drop-shadow-[0_24px_44px_rgba(172,139,203,0.28)]">
              <circle cx="150" cy="150" r="146" fill="rgba(255,255,255,0.88)" />
              {sectorData.map((sector) => (
                <g key={sector.label}>
                  <path d={sector.path} fill={sector.fill} stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
                  <text
                    x={sector.labelX}
                    y={sector.labelY}
                    fill="#5d4f6d"
                    fontSize="12"
                    fontWeight="800"
                    textAnchor="middle"
                    transform={`rotate(${sector.angle}, ${sector.labelX}, ${sector.labelY})`}
                  >
                    {sector.label.replace(/ [^\s]+$/, '')}
                  </text>
                </g>
              ))}
              <circle cx="150" cy="150" r="28" fill="white" />
              <circle cx="150" cy="150" r="18" fill="#f7d8ef" />
            </svg>
          </motion.div>
        </div>

        <div className="relative">
          <div className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[var(--ink)]">
            <Sparkles size={16} className="text-violet-400" />
            six cute outcomes
          </div>
          <div className="mt-4 grid gap-3">
            {outcomes.map((outcome, index) => (
              <div
                key={outcome.label}
                className={`rounded-[1.25rem] px-4 py-3 text-sm text-[rgba(93,79,109,0.76)] ${
                  favoriteIndices.includes(index)
                    ? 'bg-[linear-gradient(135deg,rgba(255,227,239,0.82),rgba(248,233,255,0.82))] ring-1 ring-rose-200/70'
                    : 'bg-white/60'
                }`}
              >
                <span className="font-extrabold text-[var(--ink-strong)]">{index + 1}.</span> {outcome.label}
                {favoriteIndices.includes(index) ? (
                  <span className="ml-2 inline-flex rounded-full bg-white/75 px-2 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-rose-500">
                    always lands here
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PopupMessage
        isOpen={Boolean(selected)}
        kind="modal"
        title={selected?.label}
        body={selected?.message}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
