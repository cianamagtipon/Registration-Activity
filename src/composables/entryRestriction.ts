export const entryRestriction = () => {
  // Allow only digits (0-9)
  const onlyDigits = (event: KeyboardEvent, value: string) => {
    // (Additional condition for zip) Doesn't start with 0
    if (event.key === '0' && value === '') {
      event.preventDefault()
    }

    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  // Allow only letters, space, period, apostrophe, and hyphen
  const onlyLetters = (event: KeyboardEvent) => {
    if (!/[a-zA-Z\s.'-]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const onlyAlphaNumeric = (event: KeyboardEvent) => {
    if (!/[0-9a-zA-Z\s.'-]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const onlyMiddleInitial = (event: KeyboardEvent) => {
    if (!/[a-zA-Z]/.test(event.key)) {
      event.preventDefault()
    }
  }

  // Abbreviate common street names for address formatting
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

  // Check if input is only spaces
  const isOnlySpaces = (input: string): boolean => {
    return input.trim() === ''
  }

  // Replace multiple spaces with a single space and trim
  const normalizeSpaces = (input: string): string => {
    return input.replace(/\s+/g, ' ').trim()
  }

  // Allow only one space at a time and no leading space
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

  // Remove all characters except letters, numbers, and spaces
  const removeSymbols = (input: string): string => {
    return input.replace(/[^a-zA-Z0-9\s]/g, '')
  }

  // Remove emojis and pictographs from input
  const removeEmojis = (input: string): string => {
    return input.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      '',
    )
  }

  // Prevent pasting into the input
  const preventPaste = (event: ClipboardEvent) => {
    event.preventDefault()
  }

  // Check if input is invalid: only spaces or contains emoji
  const isInvalidInput = (input: string): boolean => {
    return isOnlySpaces(input) || removeEmojis(input) !== input
  }

  return {
    onlyDigits,
    onlyLetters,
    onlyAlphaNumeric,
    onlyMiddleInitial,
    abbreviateStreet,
    isOnlySpaces,
    normalizeSpaces,
    onlyOneSpace,
    removeSymbols,
    removeEmojis,
    preventPaste,
    isInvalidInput,
  }
}
