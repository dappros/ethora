import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers"
import Web3Modal from 'web3modal'
import detectEthereumProvider from '@metamask/detect-provider'

import { config } from "@/constants/config";
import { useAppStore } from "@/store";

//create a context, with createContext api
export const Web3ProviderContext = createContext(null);

const Web3Provider = (props) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  const { app, setError } = useAppStore();

  useEffect(() => {
    function onAccountChange(accounts: any) {
      console.log("onAccountChange ", accounts);
    }

    function onChainChanged(chainId) {
      if (chainId !== config.networkIdHex) {
        console.log('chainId Error')
        setError('ChainId Error')
      }
      console.log("onChainChanged ", chainId)
    }

    if (provider) {
      // console.log(provider.selectedAddress)
      window.ethereum.on("accountsChanged", onAccountChange)
      window.ethereum.on('chainChanged', onChainChanged)
    }

    return () => {
      if (provider) {
        window.ethereum.removeListener("accountsChanged", onAccountChange)
        window.ethereum.removeListener("chainChanged", onChainChanged)
      }
    }
  }, [provider]);

  async function connectWallet() {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {},
      });

      const web3ModalInstance = await web3Modal.connect();

      const web3ModalProvider = new ethers.providers.Web3Provider(
        web3ModalInstance
      );
      return {
        web3ModalInstance,
        web3ModalProvider
      }
    } catch (error) {
      console.error('context ', error);
    }
  }

  async function isMetamaskInstalled() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      return true
    } else {
      return false
    }
  }

  return (
    <Web3ProviderContext.Provider value={{provider, setProvider, connectWallet, isMetamaskInstalled}}>
      {props.children}
    </Web3ProviderContext.Provider>
  );
};

export default Web3Provider;
