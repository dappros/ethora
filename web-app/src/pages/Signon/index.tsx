import * as React from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container';
import { injected } from "../../connector";
import { useWeb3React } from "@web3-react/core";
import * as http from '../../http'
import { useState } from '../../store';
import { useHistory } from 'react-router-dom';
import { useQuery } from '../../utils';
import EmailModal from './EmailModal'
import UsernameModal from './UsernameModal'
import MetamaskModal from './MetamaskModal';

export default function Signon() {
  const setUser = useState(state => state.setUser)
  const user = useState(state => state.user)
  const query = useQuery();
  const history = useHistory()
  const { active, account, library, activate } = useWeb3React();
  const [openEmail, setOpenEmail] = React.useState(false)
  const [openUsername, setOpenUsername] = React.useState(false)
  const [showMetamask, setShowMetamask] = React.useState(false)

  React.useEffect(() => {
    if (user.firstName) {
      history.push(`/profile/${user.walletAddress}`)
    }
  }, [user])

  const onMetamaskLogin = async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }

  React.useEffect(() => {
    const type = query.get('type')
    if (type) {
      switch(type) {
        case 'username': {
          setOpenUsername(true)
          break
        }
        case 'email': {
          setOpenEmail(true)
          break
        }
        default: {
          break
        }
      }
    }
  }, [query])

  React.useEffect(() => {
    console.log('active ', active)
    if (active) {
      console.log(active, account)

      if (account) {
        http.checkExtWallet(account)
        .then(async (result) => {
          console.log('login user')
          const signer = library.getSigner();
          const msg = 'Login'
          const signature = await signer.signMessage(msg)
          const resp = await http.loginSignature(account, signature, msg)
          const user = resp.data.user

          setUser({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            xmppPassword: user.xmppPassword,
            walletAddress: user.defaultWallet.walletAddress,
            token: resp.data.token,
            refreshToken: resp.data.refreshToken
          })

          history.push(`/profile/${user.defaultWallet.walletAddress}`)
        })
        .catch(error => {
          console.log(error)
          if (error.response && error.response.status === 404) {
            console.log('registering user')
            setShowMetamask(true)

          } else {
            console.log('other errors')
          }
        })
      }
    }
  }, [active, account])

  return (
    <Container  maxWidth="xl" style={{display: 'flex', flexDirection: 'column', height: 'calc(100vh - 68px)', justifyContent: 'center', alignItems: 'center'}}>
      <Box sx={{marginTop: 5}} style={{display: 'flex', maxWidth: '300px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {/* <Button sx={{ margin: 1}} fullWidth variant="outlined" color="secondary">Continue with Facebook</Button>
        <Button sx={{ margin: 1}} fullWidth variant="outlined">Continue with Google</Button> */}
        <Button sx={{ margin: 1}} fullWidth variant="outlined" onClick={onMetamaskLogin}>Continue with Metamask</Button>
        <Button sx={{ margin: 1}} fullWidth variant="outlined" onClick={() => setOpenEmail(true)}>Continue with e-mail</Button>
        <Button sx={{ margin: 1}} fullWidth variant="outlined" onClick={() => setOpenUsername(true)}>Continue with username</Button>
      </Box>

      <MetamaskModal open={showMetamask} setOpen={setShowMetamask} />
      <EmailModal open={openEmail} setOpen={setOpenEmail}></EmailModal>
      <UsernameModal open={openUsername} setOpen={setOpenUsername}></UsernameModal>
    </Container>
  )
}