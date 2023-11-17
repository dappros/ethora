export const weiToNormalUnits = (wei: number) => {
  const divider = 10 ** 17
  return wei / divider
}
