import { useCallback, useEffect, useState } from 'react'
import { createId, sample } from '../utils/helpers'

export function useSweetPopups(messages, enabled) {
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    if (!enabled || !messages.length) {
      return undefined
    }

    const delay = 14000 + Math.floor(Math.random() * 5000)
    const timer = window.setTimeout(() => {
      setPopup({
        id: createId(),
        title: 'Little sparkle note',
        body: sample(messages),
        kind: 'toast',
      })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [enabled, messages, popup?.id])

  const dismissPopup = useCallback(() => {
    setPopup(null)
  }, [])

  const showPopup = useCallback((message) => {
    setPopup({
      id: createId(),
      kind: 'toast',
      ...message,
    })
  }, [])

  return {
    popup,
    dismissPopup,
    showPopup,
  }
}
