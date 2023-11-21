export function walletToUsername(string_: string) {
  if (string_) {
    return string_.replaceAll(/([A-Z])/g, "_$1").toLowerCase()
  }
  return ""
}

export function usernameToWallet(string_: string) {
  return string_.replaceAll(/_([a-z])/gm, (m1: string, m2: string) => {
    return m2.toUpperCase()
  })
}
