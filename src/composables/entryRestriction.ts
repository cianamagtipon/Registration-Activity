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
    }

    return input.replace(
      /\b(street|avenue|boulevard|road|drive|lane|court|place|highway)\b/gi,
      (match) => replacements[match.toLowerCase()]
    )
  }

  return {
    onlyDigits,
    onlyLetters,
    abbreviateStreet,
  }
}
