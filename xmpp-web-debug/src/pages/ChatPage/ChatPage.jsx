import {useState, useEffect} from 'react';
import styles from './ChatPage.module.css';
import { useStore } from '../../store';

import xmppService from '../../XmppService'

export default function ChatPage() {
  const [jid, setJid] = useState('');
  const isConnected = useStore((state) => state.isConnected)

  useEffect(() => {
    xmppService.getRooms().then((result) => {
      console.log({result: result.toString()})
    })
  }, [])

  const onAddChat = async () => {
    console.log('onClick')
    if (!jid.length) {
      return
    }
    console.log(jid)
    xmppService.presence(jid)
  }

  return (
    <div className={styles.container}>
      <div>isConnected {isConnected ? 'true' : 'false'}</div>
      <div>
        <input type="text" placeholder="chat jid" value={jid} onChange={(e) => setJid(e.target.value)}/>
        <button onClick={onAddChat}>Add Chat</button>
      </div>
      <div className={styles.chat}>
        <div className={styles.list}>
          <div>
            Chat List Header
          </div>
        </div>
        <div className={styles.main}></div>
      </div>
    </div>
  )
}
