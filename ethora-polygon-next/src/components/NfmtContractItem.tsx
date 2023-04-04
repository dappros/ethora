import { useEffect, useState, useContext } from "react"
import {ethers} from 'ethers'

import { Web3ProviderContext } from "@/context/Web3Provider";
import AllScreenLoader from "./AllScreenLoader";

import { config } from '@/constants/config'
import NfmtEthoraAbi from '@/constants/ABI/EthoraNfmt.json'
import useSwal from "@/hooks/useSwal";

interface IContractItemProps {
  data: {
    contractAddress: string
    name: string
    symbol: string
    owner: string
    urls: string[],
    costs: string[],
    images: string[],
    maxSupplies: string[]
  }
}

export default function NfmtContractItem(props: IContractItemProps) {
  const swal = useSwal()
  const [startFreeMint, setStartFreeMint] = useState(false)
  const { connectWallet, isMetamaskInstalled } = useContext(Web3ProviderContext)

  const [freeIndex, setFreeIndex] = useState<number>(-1)

  function showCostWithTokenId(costs: string[]) {
    return costs.map((el, index) => {
      return `tokenId ${index + 1} - ${el} wei`
    }).join(',')
  }

  async function mintForFree(index: number) {
    const isMetamask = await isMetamaskInstalled()

    if (!isMetamask) {
      swal.fire('Install Metamask first')
      return
    }

    setStartFreeMint(true)
    try {
      const { web3ModalInstance, web3ModalProvider } = await connectWallet();

      console.log(web3ModalInstance.selectedAddress)

      if (web3ModalInstance.chainId !== config.networkIdHex) {
        alert("Please change your network to " + config.networkName);
        return;
      }

      const signer = web3ModalProvider.getSigner();
      const ethoraCoin = new ethers.Contract(
        props.data.contractAddress,
        NfmtEthoraAbi.abi,
        signer
      );

      const transaction = await ethoraCoin.mint(index + 1, 1, web3ModalInstance.selectedAddress);
      const transactionReceipt = await transaction.wait();

      alert("Success")

    } catch (error) {
      console.log('error ', error)

    }
    setStartFreeMint(false)
  }

  useEffect(() => {
    function checkForZeroCost(costs: string[]) {
      const index = costs.findIndex((el) => el == "0")
      return index
    }

    const index = checkForZeroCost(props.data.costs)

    setFreeIndex(index)
  }, [props.data])

  return (
    <div className="border p-10">
      <div className={`w-full h-[200px] overflow-hidden`}>
        <img src={props.data.images[0]} alt="" />
      </div>
      <div>
        Token Name: {props.data.name}
      </div>
      <div>Costs: {showCostWithTokenId(props.data.costs)}</div>
      {
        (freeIndex > -1) && (
          <div className="flex mt-3 justify-center">
            <button onClick={() => mintForFree(freeIndex)} className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center">Mint for free</button>
          </div>
        )
      }
      {(startFreeMint) && <AllScreenLoader />}
    </div>
  )
}