const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const playCoinSound = (amount: number) => {
  const clampedAmount = clamp(amount, 1, 7);
  const audioSrc =
    window.location.origin + "/tokenSounds/token" + clampedAmount + ".mp3";
  new Audio(audioSrc).play();
};
