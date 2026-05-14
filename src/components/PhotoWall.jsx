import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Move, Sparkles, X } from 'lucide-react'

export default function PhotoWall({ photos }) {
  const [selected, setSelected] = useState(null)
  const containerRef = useRef(null)

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <p className="section-label text-xs uppercase tracking-[0.24em]">तस्वीरों की दीवार</p>
        <h2 className="section-title !mt-5 !text-[clamp(2.6rem,6vw,4.3rem)]">A little wall of Cutie ki Tasveere</h2>
        <p className="section-copy">
          Each polaroid is draggable, a little messy in the cutest way, and ready for real photos whenever you swap them in.(Itni English aati hai na samajh?)
        </p>
        <div className="glass-chip mt-6 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-[rgba(93,79,109,0.72)]">
          <Move size={16} className="text-rose-400" />
          drag them around, tap one to zoom in
        </div>
      </div>

      <div ref={containerRef} className="glass-card relative h-[34rem] rounded-[2.2rem] p-4 sm:h-[38rem] md:h-[42rem]">
        <div className="glow-ring" />
        <div className="absolute inset-4 rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(252,244,255,0.42))]" />

        {photos.map((photo) => (
          <motion.button
            key={photo.src}
            type="button"
            drag
            dragElastic={0.24}
            dragConstraints={containerRef}
            initial={{ rotate: photo.rotate }}
            whileHover={{ y: -12, rotate: 0, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(photo)}
            className="polaroid-card z-10 text-left"
            style={{ left: photo.left, top: photo.top }}
          >
            <div className="relative overflow-hidden rounded-[1.2rem] border border-white/80 bg-gradient-to-br from-rose-100 via-white to-violet-100">
              <img
                src={photo.src}
                alt={photo.caption}
                className="h-40 w-full rounded-[1.2rem] object-cover"
                loading="lazy"
              />
              <div className="absolute left-3 top-3 tiny-badge text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-[var(--ink)]">
                <Sparkles size={12} className="text-rose-400" />
                {photo.sticker}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="font-extrabold text-[var(--ink-strong)]">{photo.caption}</p>
              <Heart size={16} className="text-rose-300" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(82,58,98,0.42)] p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              className="glass-card relative w-[min(92vw,36rem)] rounded-[2rem] p-4 sm:p-5"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="secondary-button absolute right-4 top-4 h-11 w-11 rounded-full p-0"
                aria-label="Close photo modal"
              >
                <X size={18} />
              </button>
              <img
                src={selected.src}
                alt={selected.caption}
                className="h-[24rem] w-full rounded-[1.5rem] object-cover sm:h-[30rem]"
              />
              <div className="mt-4">
                <div className="section-label text-[0.72rem] uppercase tracking-[0.22em]">{selected.sticker}</div>
                <p className="mt-3 text-xl font-extrabold text-[var(--ink-strong)]">{selected.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
