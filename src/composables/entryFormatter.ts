export const entryFormatter = () => {
  const toTitleCase = (value: string) => {
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatMiddleInitial = (mi?: string) => {
    if (!mi) return undefined
    const letter = mi.trim().charAt(0).toUpperCase()
    return letter ? `${letter}.` : undefined
  }

  return {
    toTitleCase,
    formatMiddleInitial,
  }
}
