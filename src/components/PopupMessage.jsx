import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'

export default function PopupMessage({
  isOpen,
  title,
  body,
  paragraphs,
  kind = 'toast',
  onClose,
  autoClose = 3200,
}) {
  useEffect(() => {
    if (!isOpen || kind !== 'toast' || !autoClose) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      onClose?.()
    }, autoClose)

    return () => window.clearTimeout(timer)
  }, [autoClose, isOpen, kind, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        kind === 'modal' ? (
          <motion.div
            key="modal-popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(79,53,92,0.34)] p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="modal-shell relative overflow-hidden p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={onClose}
                className="secondary-button absolute right-4 top-4 h-11 w-11 rounded-full p-0"
                aria-label="Close popup"
              >
                <X size={18} />
              </button>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--ink)]">
                <Heart size={16} className="text-rose-400" />
                hidden birthday note
              </div>

              <h3 className="section-title !mb-4 !text-[clamp(2.3rem,5vw,3.6rem)]">{title}</h3>

              <div className="space-y-4 pr-2">
                {(paragraphs || (body ? [body] : [])).map((paragraph) => (
                  <p key={paragraph} className="paper-text">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="toast-popup"
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="fixed left-1/2 top-5 z-[65] w-[min(90vw,26rem)] -translate-x-1/2"
          >
            <div className="glass-card rounded-[1.6rem] px-4 py-4 sm:px-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100/90 text-rose-400">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-[var(--ink-strong)]">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-[rgba(93,79,109,0.78)]">{body}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 text-[rgba(93,79,109,0.58)] transition hover:bg-white/70 hover:text-[var(--ink)]"
                  aria-label="Dismiss message"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )
      ) : null}
    </AnimatePresence>
  )
}
