export const dateRestriction = () => {
  const disableTooYoung = (date: Date) => {
    const today = new Date()
    const minAllowedDate = new Date(
      today.getFullYear() - 15,
      today.getMonth(),
      today.getDate(),
    )
    return date > minAllowedDate
  }

  return {
    disableTooYoung,
  }
}
