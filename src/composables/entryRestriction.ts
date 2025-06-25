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

  return {
    onlyDigits,
    onlyLetters,
  }
}
