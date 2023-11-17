import type { ethers } from "ethers"

export interface FormattedRpcResponse {
  method: string
  address: string
  result: string
  error?: string
}

export interface FormattedRpcError {
  method: string
  error?: string
}

export interface AccountAction {
  method: string
  callback: (web3Provider?: ethers.providers.Web3Provider) => Promise<any>
}

export interface RpcRequestParams {
  method: string
  web3Provider: ethers.providers.Web3Provider
}
export interface MessageParams extends RpcRequestParams {
  message: string
}

export const signMessage = async ({
  web3Provider,
  method,
  message,
}: MessageParams): Promise<FormattedRpcResponse> => {
  if (!web3Provider) {
    throw new Error("web3Provider not connected")
  }
  const msg = message

  const [address] = await web3Provider.listAccounts()
  console.log(address, msg)
  if (!address) {
    throw new Error("No address found")
  }

  const signature = await web3Provider.send("personal_sign", [msg, address])
  return {
    method,
    address,
    result: signature,
  }
}
