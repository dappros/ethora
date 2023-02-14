export function walletToUsername(str: string) {
  if (str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
  return "";
}

export function usernameToWallet(str: string) {
  return str.replace(/_([a-z])/gm, (m1: string, m2: string) => {
    return m2.toUpperCase();
  });
}
