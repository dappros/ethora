const clamp = (number_: number, min: number, max: number) =>
  Math.min(Math.max(number_, min), max)

export const playCoinSound = (amount: number) => {
  const clampedAmount = clamp(amount, 1, 7)
  const audioSource =
    window.location.origin + "/tokenSounds/token" + clampedAmount + ".mp3"
  new Audio(audioSource).play()
}
