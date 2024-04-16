import { Chat_ } from "../../components/Chat_"
import { uploadFile } from "../../http"
import { useStoreState } from "../../store"
import { walletToUsername } from "../../utils/walletManipulation"

export function ChatWrapper() {
  const { 
    user: { xmppPassword, walletAddress, firstName, lastName, profileImage },
    defaultChatRooms
  } = useStoreState(state => state)

  const xmppUsername = walletToUsername(walletAddress)

  const defaultRooms = defaultChatRooms.map((el) => el.jid)

  return (
    <Chat_ 
      xmppPassword={xmppPassword}
      xmppUsername={xmppUsername}
      walletAddress={walletAddress}
      firstName={firstName}
      lastName={lastName}
      profileImage={profileImage}
      sendFile={uploadFile}
      initRooms={[defaultRooms[0]]}
      isRestrictedToInitRooms={true}
      xmppService="wss://dev.dxmpp.com:5443/ws"
    />
  )
}
