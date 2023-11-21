interface ILink {
  firstName: string
  lastName: string
  walletAddress: string
  xmppId: string
  linkToken?: string
}

export const generateProfileLink = ({
  firstName,
  lastName,
  walletAddress,
  xmppId,
  linkToken,
}: ILink) => {
  return `=profileLink&firstName=${firstName}&lastName=${lastName}&walletAddress=${walletAddress}&xmppId=${xmppId}&linkToken=${
    linkToken ?? ""
  }`
}
