/**
 * Getting a random number between 0 (inclusive) and 1 (exclusive)
 *
 * @returns
 */
export function getRandom() {
  return Math.random()
}

/**
 * Getting a random number between two values
 *
 * @param min
 * @param max
 * @returns
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}

/**
 * Getting a random integer between two values
 *
 * @param min
 * @param max
 * @returns
 */
export function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

/**
 * Getting a random integer between two values, inclusive
 *
 * @param min
 * @param max
 * @returns
 */
export function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}
