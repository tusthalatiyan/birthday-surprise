import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

export default function Timeline({ milestones }) {
  return (
    <div>
      <p className="section-label text-xs uppercase tracking-[0.24em]">WHEN VIDUSHI LOOKS CUTEST TO ME 💖 </p>
      <h2 className="section-title !mt-5 !text-[clamp(2.6rem,6vw,4.3rem)]">The exact moments when Vidushi looks the cutest 🥹✨</h2>
      <p className="section-copy">
        I tried calculating the answer scientifically...
      </p>

      <div className="relative mt-10">
        <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-rose-200 via-violet-200 to-transparent sm:block" />

        <div className="space-y-5">
          {milestones.map((milestone, index) => (
            <motion.article
              key={milestone.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: Math.min(index * 0.08, 0.3) }}
              className="glass-card relative rounded-[1.9rem] p-5 sm:ml-12 sm:p-6"
            >
              <div className="absolute -left-2 top-8 hidden h-4 w-4 rounded-full bg-rose-300 shadow-[0_0_18px_rgba(255,176,207,0.9)] sm:block" />
              <div className="flex flex-wrap items-center gap-3">
                <span className="section-label !px-3 !py-2 text-[0.68rem] uppercase tracking-[0.2em]">
                  {milestone.label}
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[rgba(93,79,109,0.62)]">
                  {index % 2 === 0 ? <Sparkles size={14} className="text-violet-400" /> : <Heart size={14} className="text-rose-400" />}
                  Mammi kasam
                </span>
              </div>

              <h3 className="mt-4 text-[1.65rem] font-extrabold text-[var(--ink-strong)]">{milestone.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(93,79,109,0.76)]">{milestone.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}


