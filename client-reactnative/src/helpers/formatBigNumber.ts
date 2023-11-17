export function formatBigNumber(num: number) {
  const value = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const arr = value.split(",")
  if (arr[arr.length - 1] === "000") {
    arr.pop()
    return arr.join(",") + "K"
  }
  return value
}
