export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const sample = (items) => items[Math.floor(Math.random() * items.length)]

export const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
