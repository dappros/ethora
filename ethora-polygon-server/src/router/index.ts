import {Router} from 'express'
import multer from 'multer'
import {format} from 'date-fns'

import Nfmt from '../db/models/nfmt'
import {authMw, AuthRequest} from '../middleware/auth'

import { preDeployNfmtHandler } from '../handlers/preDeployNfmt'
import { getProfileHandler } from '../handlers/getProfileHandler'
import { updateProfile } from '../handlers/updateProfile'
import { afterDeployHandler } from '../handlers/afterDeployHandler'

const upload = multer({ dest: 'uploads/' })
const router = Router()

router.get('/hello', (req, res) => {
  res.send('Hello')
})

router.get('/nfmt', async (req, res) => {
  const nfmt = await Nfmt.find({contractAddress: {$exists: true}}).sort({createdAt: -1})

  return res.send(nfmt)
})

router.post(
  '/pre-deploy-nfmt',
  authMw,
  upload.array('images', 5),
  preDeployNfmtHandler
)

router.post('/upload', authMw, upload.array('images', 5), (req, res) => {
  console.log('/upload start')
  return res.send({files: req.files})
})

router.post('/after-deploy-nfmt/:id', authMw, afterDeployHandler)

router.get('/profile/:address', getProfileHandler)
router.post('/profile', authMw, upload.single('image'), updateProfile)

router.get('/auth-data', (req: any, res) => {
  const ttl = Date.now() + 86400000
  const msgParams = {
    domain: {
      name: "EthoraPolygonDev",
      version: "1",
    },
    message: {
      message: `Ethora Polygon Dev Sign In\n\nToken valid till: ${format(new Date(ttl), 'yyyy-MM-dd HH:mm aa')}`,
    },
    primaryType: "Login",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
      ],
      Login: [{ name: "message", type: "string" }],
    },
  };
  return res.send({msgParams, ttl})
})

export default router
