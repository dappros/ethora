import { Chat_ } from "../../components/Chat_"
import { useStoreState } from "../../store"

export function ChatWrapper() {
  const { 
    user: { xmppPassword, walletAddress, firstName, lastName, profileImage },
    defaultChatRooms
  } = useStoreState(state => state)

  const defaultRooms = defaultChatRooms.map((el) => el.jid.split('@')[0])

  return (
    <>
      <Chat_ 
        xmppPassword={xmppPassword}
        walletAddress={walletAddress}
        firstName={firstName}
        lastName={lastName}
        profileImage={profileImage}
        defaultRooms={defaultRooms}
        xmppConnectionUrl="wss://dev.dxmpp.com:5443/ws"
      />
    </>
  )
}
