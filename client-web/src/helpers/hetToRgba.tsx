export function hexToRGBA(hex: string, opacity: number = 0.05): string {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16))
  return `rgba(${r},${g},${b},${opacity})`
}
