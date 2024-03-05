export function isDateValid(dateString: string | number) {
  const dateObject = new Date(dateString)
  return !isNaN(dateObject.getTime())
}

export const compareCondition = (
  condition: string,
  value1: string | number,
  value2: string | number
) => {
  let convertedVal1: string | number | Date
  let convertedVal2: string | number | Date
  if (isDateValid(value1) && isDateValid(value2)) {
    convertedVal1 = new Date(value1)
    convertedVal2 = new Date(value2)
  }
  if (condition === 'equals') return convertedVal1 === convertedVal2
  if (condition === 'does_not_equal') return convertedVal1 !== convertedVal2
  if (condition === 'greater_than') return convertedVal1 > convertedVal2
  if (condition === 'less_than') return convertedVal1 < convertedVal2
}
