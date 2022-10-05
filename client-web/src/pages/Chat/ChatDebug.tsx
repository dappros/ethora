import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import xmpp, {walletToUsername} from '../../xmpp'
import Web3 from 'web3'

export default function ChatDebug() {
  const [room, setRoom] = React.useState('')
  const [wallet, setWallet] = React.useState('')
  const onSubscribe = () => {
    xmpp.subsribe(room)
  }

  const getVcard = () => {
    const checksumAddress = Web3.utils.toChecksumAddress(wallet)
    const username = walletToUsername(checksumAddress)
    console.log('username ', username)
    xmpp.getVcard(username)
  }

  return (
    <Box>
      <Box>ChatDebug</Box>
      <Box>My jid: {xmpp.client.jid?.toString()}</Box>
      <Box>
        <TextField value={room} onChange={(e) => setRoom(e.target.value)}></TextField>
        <Button onClick={onSubscribe}>Subscribe</Button>
      </Box>

      <Box>
        <TextField value={room} onChange={(e) => setRoom(e.target.value)}></TextField>
        <Button onClick={() => xmpp.unsubscribe(room)}>unsubscribe</Button>
      </Box>
      <Box>
        <Button onClick={() => xmpp.getRooms()}>getRooms</Button>
      </Box>
      <Box>
        <Button onClick={() => xmpp.discoInfo()}>discoInfo</Button>
      </Box>
      <Box>
        <Button onClick={() => xmpp.presence()}>presence</Button>
      </Box>
      <Box>
        <TextField value={wallet} onChange={(e) => setWallet(e.target.value)}></TextField>
        <Button onClick={getVcard}>getVcard</Button>
      </Box>
      <Box>
        <TextField value={room} onChange={(e) => setRoom(e.target.value)}></TextField>
        <Button onClick={() => xmpp.roomPresence(room)}>roomPresence</Button>
      </Box>
      <Box>
        <TextField value={room} onChange={(e) => setRoom(e.target.value)}></TextField>
        <Button onClick={() => xmpp.botPresence(room)}>botPresence</Button>
      </Box>
    </Box>
  )
}