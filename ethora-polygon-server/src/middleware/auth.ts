import express, {Request, Response, NextFunction} from 'express'
import * as sigUtil from '@metamask/eth-sig-util'
import {SignTypedDataVersion} from '@metamask/eth-sig-util'
import { format } from 'date-fns'

function return401(res: Response) {
  return res.status(401).end()
}

function tokenParser(token: string) {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString())
  } catch (e) {
    return null
  }
}

export type AuthRequest = express.Request & {
  user: {
    address: string
  }
}

export function authMw(req: any, res: Response, next: NextFunction) {
  const authHeader = req.header('authorization') as string

  const parsed = tokenParser(authHeader)

  if (parsed) {
    const { ttl, sign, address } = parsed

    if (!sign || ttl < Date.now()) {
      return return401(res)
    }

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
    try {
      console.log(JSON.stringify(msgParams))
      const recoveredAddress = sigUtil.recoverTypedSignature({ data: msgParams as any, signature: sign as string, version: SignTypedDataVersion.V4 } )

      if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        req.user = {
          address
        }
        next()
      } else {
        console.log("recoveredAddress.toLowerCase() === address.toLowerCase()")
        console.log(recoveredAddress.toLowerCase())
        console.log(address.toLowerCase())
        return return401(res)
      }
    } catch (error) {
      console.log('catch (error)')
      console.log(error)
      return return401(res)
    }
  } else {
    return return401(res)
  }
}