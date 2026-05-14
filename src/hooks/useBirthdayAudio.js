import { useCallback, useEffect, useRef, useState } from 'react'

const PRIMARY_TRACK = { src: '/audio/Utube.wav', label: 'Utube.wav' }
const SECONDARY_TRACK = { src: '/audio/Utube.mp3', label: 'Utube.mp3' }

export function useBirthdayAudio() {
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [musicSource, setMusicSource] = useState(PRIMARY_TRACK.src)
  const [musicLabel, setMusicLabel] = useState(PRIMARY_TRACK.label)
  const [usingCustomTrack, setUsingCustomTrack] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const verifyTrack = async (track) => {
      try {
        const response = await fetch(track.src, { method: 'HEAD' })
        const contentType = response.headers.get('content-type') || ''

        if (!cancelled && response.ok && contentType.startsWith('audio/')) {
          setMusicSource(track.src)
          setMusicLabel(track.label)
          setUsingCustomTrack(true)
          return true
        }
      } catch {
        // Keep checking the next possible file.
      }

      return false
    }

    const selectTrack = async () => {
      if (await verifyTrack(PRIMARY_TRACK)) {
        return
      }

      if (await verifyTrack(SECONDARY_TRACK)) {
        return
      }

      if (!cancelled) {
        setMusicSource('')
        setMusicLabel('Utube track missing')
        setUsingCustomTrack(false)
      }
    }

    selectTrack()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!musicSource) {
      return undefined
    }

    const audio = new window.Audio(musicSource)
    audio.preload = 'auto'
    audio.loop = false
    audio.volume = 0.9

    const handleEnded = async () => {
      audio.currentTime = 0

      if (audioUnlocked && musicEnabled) {
        try {
          await audio.play()
        } catch {
          // Ignore autoplay rejections until the next user gesture.
        }
      }
    }

    const handleError = () => {
      if (musicSource === PRIMARY_TRACK.src) {
        setMusicSource(SECONDARY_TRACK.src)
        setMusicLabel(SECONDARY_TRACK.label)
        return
      }

      setMusicSource('')
      setMusicLabel('Utube track missing')
      setUsingCustomTrack(false)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audioRef.current = audio

    if (audioUnlocked && musicEnabled) {
      audio.play().catch(() => {
        // Ignore autoplay rejections until the next user gesture.
      })
    }

    return () => {
      audio.pause()
      audio.currentTime = 0
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)

      if (audioRef.current === audio) {
        audioRef.current = null
      }
    }
  }, [audioUnlocked, musicEnabled, musicSource])

  const primeAudio = useCallback(() => {
    setAudioUnlocked(true)
  }, [])

  const toggleMusic = useCallback(() => {
    setAudioUnlocked(true)
    setMusicEnabled((current) => !current)
  }, [])

  const playNothing = useCallback(() => {}, [])

  return {
    musicEnabled,
    toggleMusic,
    primeAudio,
    playClick: playNothing,
    playReveal: playNothing,
    playGift: playNothing,
    playWin: playNothing,
    playFinale: playNothing,
    usingCustomTrack,
    musicLabel,
  }
}
