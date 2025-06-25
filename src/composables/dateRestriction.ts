export const dateRestriction = () => {
  const today = new Date()
  const minAllowedDate = new Date(
    today.getFullYear() - 15,
    today.getMonth(),
    today.getDate(),
  )

  const tooYoung = (date: Date) => {
    return date > minAllowedDate
  }

  const defaultDate = minAllowedDate

  return {
    tooYoung,
    defaultDate,
  }
}
