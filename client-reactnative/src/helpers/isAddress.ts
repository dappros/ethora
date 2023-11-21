export const isAddress = (address: string) => {
  // check if it has the basic requirements of an address
  return address.startsWith("0x")
}
