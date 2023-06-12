import dotenv from 'dotenv'

dotenv.config()

export default {
  appPort: process.env.PORT || '3030',
  mongoUri: process.env.MONGO || 'mongodb://localhost:27017/ethora-polygon',
  alchemyWs: process.env.ALCHEMY_WS || '',
  pinataKey: process.env.PINATA_API_KEY,
  pinataSecret: process.env.PINATA_API_KEY_SECRET,
  pinataGateway: 'https://dapprossplatform.mypinata.cloud/ipfs/',
  xmppAdmin: process.env.XMPP_ADMIN || "",
  xmppPass: process.env.XMPP_PASS || "",
  xmppHost: process.env.XMPP_HOST || "",
  xmppPath: process.env.XMPP_PATH || ''
}