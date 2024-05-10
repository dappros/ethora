import { uploadFile } from "../../http"
import { Temp } from "../../libs/ChatApp2/tmp/Temp"
import { useStoreState } from "../../store"
import { walletToUsername } from "../../utils/walletManipulation"

export function ChatWrapper() {
  const { 
    user: { xmppPassword, walletAddress, firstName, lastName, profileImage },
    defaultChatRooms
  } = useStoreState(state => state)

  const xmppUsername = walletToUsername(walletAddress)

  const defaultRooms = defaultChatRooms.map((el) => el.jid).concat("974add7ad347cd39b5fff2c16939003a27ce74f038cdc9884c03575e28078394@conference.dev.dxmpp.com")

  return (
    <div>
      <Temp 
        xmppUsername={xmppUsername} 
        xmppPassword={xmppPassword} 
        firstName={firstName} 
        lastName={lastName}
        profileImage={profileImage}
        walletAddress={walletAddress}
      />
    </div>
  )
}
