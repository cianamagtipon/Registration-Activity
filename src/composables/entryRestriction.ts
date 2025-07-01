export const entryRestriction = () => {
  const onlyDigits = (event: KeyboardEvent) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const onlyLetters = (event: KeyboardEvent) => {
    if (!/[a-zA-Z\s.'-]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const abbreviateStreet = (input: string): string => {
    const replacements: Record<string, string> = {
      street: 'St.',
      avenue: 'Ave.',
      boulevard: 'Blvd.',
      road: 'Rd.',
      drive: 'Dr.',
      lane: 'Ln.',
      court: 'Ct.',
      place: 'Pl.',
      highway: 'Hwy.',
      building: 'Bldg.',
      barangay: 'Brgy.',
      corner: 'Cor.',
    }

    return input.replace(
      /\b(street|avenue|boulevard|road|drive|lane|court|place|highway|building|barangay|corner)\b/gi,
      (match) => replacements[match.toLowerCase()],
    )
  }

  const isOnlySpaces = (input: string): boolean => {
    return input.trim() === ''
  }

  const normalizeSpaces = (input: string): string => {
    return input.replace(/\s+/g, ' ').trim()
  }

  const onlyOneSpace = (event: KeyboardEvent, value: string) => {
    // Disallow leading space
    if (event.key === ' ' && value === '') {
      event.preventDefault()
    }

    // Disallow consecutive spaces
    const lastChar = value[value.length - 1]
    if (event.key === ' ' && lastChar === ' ') {
      event.preventDefault()
    }
  }

  const removeSymbols = (input: string): string => {
    return input.replace(/[^a-zA-Z0-9\s]/g, '')
  }

  const preventPaste = (event: ClipboardEvent) => {
    event.preventDefault()
  }

  return {
    onlyDigits,
    onlyLetters,
    abbreviateStreet,
    isOnlySpaces,
    normalizeSpaces,
    onlyOneSpace,
    removeSymbols,
    preventPaste,
  }
}
