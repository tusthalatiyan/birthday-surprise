import { motion } from 'framer-motion'
import { Sparkles, Volume2, VolumeX } from 'lucide-react'

export default function MusicToggle({ enabled, onToggle, usingCustomTrack, musicLabel }) {
  const statusLabel = usingCustomTrack
    ? `Playing "I Think They Call This Love" for Vidushi`
    : musicLabel

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="glass-chip fixed right-4 top-4 z-40 flex min-h-12 items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm text-[var(--ink)]"
      aria-label={enabled ? 'Pause background voice' : 'Play background voice'}
      aria-pressed={enabled}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/75 text-[var(--ink-strong)] shadow-sm">
        {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </span>
      <span className="hidden sm:flex sm:flex-col">
        <span className="font-extrabold leading-none">{enabled ? 'Voice on' : 'Voice off'}</span>
        <span className="mt-1 text-xs text-[rgba(93,79,109,0.66)]">
          {statusLabel}
        </span>
      </span>
      <Sparkles size={16} className="hidden text-rose-400 sm:block" />
    </motion.button>
  )
}
