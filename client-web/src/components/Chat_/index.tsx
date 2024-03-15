type TChatProps = {
  xmppPassword: string,
  walletAddress: string,
  firstName: string,
  lastName: string,
  profileImage: string,
  defaultRooms: string[],
  xmppConnectionUrl: string
}

export function Chat_(props: TChatProps) {
  return (
    <div>Chat_ {JSON.stringify(props, null, 2)}</div>
  )
}
