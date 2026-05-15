// Drop one image into src/assets/slap-game and the game will load it automatically.
const photoModules = import.meta.glob('./slap-game/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})
const publicFallbackPhoto = '/images/tush.jpeg'

const preferredNames = ['photo.', 'slap-game-photo.', 'cheer-up-photo.']

const photoEntries = Object.entries(photoModules).sort(([pathA], [pathB]) => {
  const fileNameA = pathA.split('/').pop()?.toLowerCase() ?? ''
  const fileNameB = pathB.split('/').pop()?.toLowerCase() ?? ''
  const priorityA = preferredNames.findIndex((prefix) => fileNameA.startsWith(prefix))
  const priorityB = preferredNames.findIndex((prefix) => fileNameB.startsWith(prefix))
  const normalizedPriorityA = priorityA === -1 ? preferredNames.length : priorityA
  const normalizedPriorityB = priorityB === -1 ? preferredNames.length : priorityB

  if (normalizedPriorityA !== normalizedPriorityB) {
    return normalizedPriorityA - normalizedPriorityB
  }

  return pathA.localeCompare(pathB)
})

export const slapGamePhoto = photoEntries[0]?.[1] ?? publicFallbackPhoto
