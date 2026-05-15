import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import EntryScreen from './components/EntryScreen.jsx'
import FinalReveal from './components/FinalReveal.jsx'
import GiftBox from './components/GiftBox.jsx'
import HeartGame from './components/HeartGame.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import NameReveal from './components/NameReveal.jsx'
import PhotoWall from './components/PhotoWall.jsx'
import PopupMessage from './components/PopupMessage.jsx'
import ReasonsSection from './components/ReasonsSection.jsx'
import CheerUpSlapGame from './components/CheerUpSlapGame.jsx'
import SecretLetter from './components/SecretLetter.jsx'
import SecretHunt from './components/SecretHunt.jsx'
import SpinWheel from './components/SpinWheel.jsx'
import SparkleCursor from './components/SparkleCursor.jsx'
import SurpriseChoices from './components/SurpriseChoices.jsx'
import Timeline from './components/Timeline.jsx'
import WishSky from './components/WishSky.jsx'
import { reasons } from './data/reasons.js'
import {
  birthdayLetter,
  finalNote,
  huntMessages,
  photoMemories,
  sweetPopups,
  timelineMoments,
  wheelOutcomes,
} from './data/messages.js'
import { useBirthdayAudio } from './hooks/useBirthdayAudio.js'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'
import { useSweetPopups } from './hooks/useSweetPopups.js'
import { slapGamePhoto } from './assets/slapGamePhoto.js'

export default function App() {
  const [phase, setPhase] = useState('loading')
  const [reasonsUnlocked, setReasonsUnlocked] = useState(0)
  const [huntComplete, setHuntComplete] = useState(false)
  const [visitedExperiences, setVisitedExperiences] = useState([])
  const [wishUnlocked, setWishUnlocked] = useState(false)
  const [finaleRevealed, setFinaleRevealed] = useState(false)
  const [activeExperience, setActiveExperience] = useState(null)
  const [finalMessageOpen, setFinalMessageOpen] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const reasonsRef = useRef(null)
  const huntRef = useRef(null)
  const surpriseChoicesRef = useRef(null)
  const finaleRef = useRef(null)

  const audio = useBirthdayAudio()
  const { popup, dismissPopup, showPopup } = useSweetPopups(
    sweetPopups,
    phase === 'story' && !activeExperience && !finalMessageOpen,
  )

  const backgroundStars = useMemo(
    () =>
      [...Array(20)].map((_, index) => ({
        id: index,
        left: `${4 + ((index * 13) % 90)}%`,
        top: `${4 + ((index * 17) % 88)}%`,
        size: 4 + (index % 3) * 3,
        delay: `${index * 0.24}s`,
      })),
    [],
  )

  const finaleUnlocked =
    huntComplete && reasonsUnlocked >= 11 && visitedExperiences.length >= 3 && wishUnlocked

  const progressChecks = [
    phase === 'story',
    reasonsUnlocked >= 11,
    huntComplete,
    visitedExperiences.length >= 3,
    wishUnlocked,
    finaleRevealed,
  ]

  const journeyProgress = Math.round(
    (progressChecks.filter(Boolean).length / progressChecks.length) * 100,
  )

  const finaleChecklist = [
    {
      label: 'Reveal at least 11 reasons',
      done: reasonsUnlocked >= 11,
      hint: `${reasonsUnlocked}/11 revealed so far.`,
    },
    {
      label: 'Finish the secret hunt',
      done: huntComplete,
      hint: huntComplete
        ? 'Heart, moon, teddy, butterfly, and star have all been found.'
        : 'The secret hunt section is above the timeline. Find all 5 hidden objects there.',
    },
    {
      label: 'Open at least 3 surprise cards',
      done: visitedExperiences.length >= 3,
      hint: `${visitedExperiences.length}/3 surprise experiences opened.`,
    },
    {
      label: 'Complete the wish sky',
      done: wishUnlocked,
      hint: wishUnlocked
        ? 'VIDUSHI already appeared in the constellation.'
        : 'Open the Make a wish card and keep tapping the sky until the constellation appears.',
    },
  ]

  const scrollToRef = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const beginJourney = () => {
    setPhase('entry')
  }

  const advanceToName = () => {
    audio.primeAudio()
    audio.playClick()
    setPhase('name')
  }

  const advanceToGift = () => {
    audio.playClick()
    setPhase('gift')
  }

  const advanceToStory = () => {
    audio.playClick()
    setPhase('story')
    showPopup({
      title: 'Storybook unlocked',
      body: 'The rest of the birthday surprise just opened up.',
    })
  }

  const handleReasonReveal = (reason) => {
    setReasonsUnlocked((current) => current + 1)
    audio.playReveal()
    showPopup({
      title: reason.title,
      body: reason.detail,
    })
  }

  const handleFoundSecret = (_, message, count) => {
    audio.playReveal()
    showPopup({
      title: `Hidden message ${count}/5`,
      body: message,
    })
  }

  const handleHuntComplete = () => {
    setHuntComplete(true)
    showPopup({
      title: 'Mystery vault unlocked',
      body: 'The fake locked surprise is real now. Go wake it up in the surprise choices section.',
    })
  }

  const openExperience = (experienceId) => {
    audio.primeAudio()
    audio.playClick()
    setVisitedExperiences((current) =>
      current.includes(experienceId) ? current : [...current, experienceId],
    )
    setActiveExperience(experienceId)
  }

  const closeExperience = () => {
    audio.playClick()
    setActiveExperience(null)
  }

  const openVault = () => {
    if (huntComplete) {
      audio.playReveal()
      scrollToRef(finaleRef)
      showPopup({
        title: 'Vault opened',
        body: 'The grand finale section is waiting right below.',
      })
      return
    }

    audio.playClick()
    scrollToRef(huntRef)
    showPopup({
      title: 'Start with the secret hunt',
      body: 'It is the section with the hidden heart, moon, teddy, butterfly, and star.',
    })
  }

  const handleHeartWin = () => {
    audio.playWin()
    showPopup({
      title: 'Mini game won',
      body: 'You caught my heart too 💖',
    })
  }

  const handleWishComplete = () => {
    setWishUnlocked(true)
    audio.playReveal()
    showPopup({
      title: 'Constellation unlocked',
      body: 'The sky just spelled VIDUSHI back in stars.',
    })
  }

  const handleFinalReveal = () => {
    audio.playFinale()
    setFinaleRevealed(true)
  }

  const guideToNextUnlock = () => {
    if (!huntComplete) {
      audio.playClick()
      scrollToRef(huntRef)
      showPopup({
        title: 'Secret hunt is here',
        body: 'Find the 5 hidden objects in this section to unlock the bonus vault.',
      })
      return
    }

    if (reasonsUnlocked < 11) {
      audio.playClick()
      scrollToRef(reasonsRef)
      showPopup({
        title: 'Next step: reveal more reasons',
        body: 'Tap the Reveal another reason button until you reach at least 11.',
      })
      return
    }

    if (visitedExperiences.length < 3) {
      audio.playClick()
      scrollToRef(surpriseChoicesRef)
      showPopup({
        title: 'Open more surprise cards',
        body: 'Any 3 of the 4 surprise cards count toward unlocking the finale.',
      })
      return
    }

    if (!wishUnlocked) {
      audio.playClick()
      scrollToRef(surpriseChoicesRef)
      showPopup({
        title: 'Make a wish is still pending',
        body: 'Open the Make a wish card and tap the night sky until VIDUSHI appears.',
      })
      return
    }

    audio.playReveal()
    scrollToRef(finaleRef)
  }

  const renderExperience = () => {
    switch (activeExperience) {
      case 'letter':
        return <SecretLetter letter={birthdayLetter} />
      case 'hearts':
        return <HeartGame onWin={handleHeartWin} />
      case 'wheel':
        return <SpinWheel outcomes={wheelOutcomes} />
      case 'wish':
        return <WishSky onComplete={handleWishComplete} />
      default:
        return null
    }
  }

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <div className="relative min-h-screen overflow-x-hidden text-[var(--ink)]">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="sparkle-mist absolute inset-0" />
          {backgroundStars.map((star) => (
            <span
              key={star.id}
              className="twinkle-star absolute rounded-full bg-white/85 shadow-[0_0_18px_rgba(255,255,255,0.92)]"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        <SparkleCursor />
        <MusicToggle
          enabled={audio.musicEnabled}
          onToggle={audio.toggleMusic}
          usingCustomTrack={audio.usingCustomTrack}
          musicLabel={audio.musicLabel}
        />

        {phase === 'story' ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card fixed left-1/2 top-4 z-30 w-[min(92vw,24rem)] -translate-x-1/2 rounded-full px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-[var(--ink)]">
              <span className="inline-flex items-center gap-2">
                <Sparkles size={15} className="text-rose-400" />
                magical progress
              </span>
              <span>{journeyProgress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/55">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ffd6e7,#e6dcff,#dff2ff)]"
                animate={{ width: `${journeyProgress}%` }}
              />
            </div>
          </motion.div>
        ) : null}

        <AnimatePresence mode="wait">
          {phase === 'loading' ? (
            <LoadingScreen key="loading" onComplete={beginJourney} />
          ) : phase === 'entry' ? (
            <EntryScreen key="entry" onBegin={advanceToName} />
          ) : phase === 'name' ? (
            <NameReveal key="name" onContinue={advanceToGift} onTick={audio.playReveal} />
          ) : phase === 'gift' ? (
            <GiftBox key="gift" onOpen={audio.playGift} onContinue={advanceToStory} />
          ) : (
            <motion.main
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <section className="section-shell pt-32">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                      <p className="section-label text-xs uppercase tracking-[0.26em]">for vidushi, with too many sparkles</p>
                      <h1 className="section-title !mt-6 !text-[clamp(3.1rem,10vw,6.6rem)]">
                        A premium little birthday universe made just for one girl
                      </h1>
                      <p className="section-copy mt-4 text-[1.08rem] sm:text-[1.18rem]">
                        Made by - Head of Gawar Community
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="glass-card rounded-[1.8rem] p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[rgba(93,79,109,0.5)]">birthday date</p>
                        <p className="mt-2 text-xl font-extrabold text-[var(--ink-strong)]">8 May</p>
                      </div>
                      <div className="glass-card rounded-[1.8rem] p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[rgba(93,79,109,0.5)]">current unlock</p>
                        <p className="mt-2 text-xl font-extrabold text-[var(--ink-strong)]">
                          {finaleUnlocked ? 'Finale ready' : 'More magic ahead'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section-shell">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <PhotoWall photos={photoMemories} />
                </div>
              </section>

              <section className="section-shell">
                <div ref={reasonsRef} className="mx-auto max-w-6xl px-4 sm:px-6">
                  <ReasonsSection
                    reasons={reasons}
                    onReveal={handleReasonReveal}
                  />
                </div>
              </section>

              <section className="section-shell">
                <div ref={huntRef} className="mx-auto max-w-6xl px-4 sm:px-6">
                  <SecretHunt
                    messages={huntMessages}
                    onFound={handleFoundSecret}
                    onComplete={handleHuntComplete}
                  />
                </div>
              </section>

              <section className="section-shell">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <Timeline milestones={timelineMoments} />
                </div>
              </section>

              <section className="section-shell">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <CheerUpSlapGame photoSrc={slapGamePhoto} onTap={audio.playClick} />
                </div>
              </section>

              <section className="section-shell">
                <div ref={surpriseChoicesRef} className="mx-auto max-w-6xl px-4 sm:px-6">
                  <SurpriseChoices
                    onSelect={openExperience}
                    visited={visitedExperiences}
                    vaultUnlocked={huntComplete}
                    onVaultOpen={openVault}
                  />
                </div>
              </section>

              <section className="section-shell" ref={finaleRef}>
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                  <FinalReveal
                    isUnlocked={finaleUnlocked}
                    revealed={finaleRevealed}
                    onReveal={handleFinalReveal}
                    onOpenFinalMessage={() => setFinalMessageOpen(true)}
                    checklist={finaleChecklist}
                    onShowUnlockPath={guideToNextUnlock}
                  />
                </div>
              </section>
            </motion.main>
          )}
        </AnimatePresence>

        <PopupMessage
          isOpen={Boolean(popup)}
          kind="toast"
          title={popup?.title}
          body={popup?.body}
          onClose={dismissPopup}
        />

        <PopupMessage
          isOpen={finalMessageOpen}
          kind="modal"
          title={finalNote.title}
          paragraphs={finalNote.paragraphs}
          onClose={() => setFinalMessageOpen(false)}
        />

        <AnimatePresence>
          {activeExperience ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(73,49,88,0.42)] p-4 backdrop-blur-xl"
            >
              <motion.div
                initial={{ y: 24, scale: 0.96 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 12, scale: 0.98 }}
                className="modal-shell no-scrollbar relative p-5 sm:p-7"
              >
                <button
                  type="button"
                  onClick={closeExperience}
                  className="secondary-button absolute right-4 top-4 z-10"
                >
                  close
                </button>
                {renderExperience()}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
