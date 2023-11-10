import {useState} from 'react'
import axios from 'axios'

export default function Register() {
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [host, setHost] = useState(process.env.REACT_APP_XMPP_HOST)
  const [xmppPath, setXmppPath] = useState(process.env.REACT_APP_XMPP_PATH)
  const [adminXMPP, setAdminXMPP] = useState(process.env.REACT_APP_XMPP_ADMIN)
  const [passwordXMPP, setPasswordXMPP] = useState(process.env.REACT_APP_XMPP_PASSWORD)

  const onRegister = async function() {
    let bodydata = {
      host: host,
      user: username,
      password: password,
    };

    const tokenXMPP = `Basic ${btoa(`${adminXMPP}:${passwordXMPP}`)}`

    try {
      const res = await axios.post(
        `${xmppPath}/register`,
        {
          ...bodydata
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenXMPP,
          },
        }
      )
  
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      Register
      <div>
        <div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        </div>
        <div>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
        </div>
        <div>
          <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
        </div>
        <div>
          <input type="text" value={xmppPath} onChange={(e) => setXmppPath(e.target.value)} />
        </div>
        <div>
          <input type="text" value={adminXMPP} onChange={(e) => setAdminXMPP(e.target.value)} />
        </div>
        <div>
          <input type="text" value={passwordXMPP} onChange={(e) => setPasswordXMPP(e.target.value)} />
        </div>
        <button onClick={onRegister}>Register</button>
      </div>
    </div>
  )
}