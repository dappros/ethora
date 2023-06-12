import Head from "next/head";

import { useEffect, useState, useContext } from "react";
import Web3Modal from 'web3modal'
import {ethers} from 'ethers'
import { Web3ProviderContext } from '@/context/Web3Provider';
import { useAppStore } from "@/store"

export function Auth() {
  const { setAddress } = useAppStore();

  const [provider, setProvider] = useContext(Web3ProviderContext);

  async function connectWallet() {
    try {
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {},
      });

      const web3ModalInstance = await web3Modal.connect();
      setAddress(web3ModalInstance.selectedAddress);
      const web3ModalProvider = new ethers.providers.Web3Provider(
        web3ModalInstance
      );
      setProvider(web3ModalProvider);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>Ethora - Login</title>
      </Head>
      <main className="p-10">
        <h1 className="text-3xl">Polygon Ethora</h1>
        {!provider && <button onClick={connectWallet}>connect</button>}
        {provider && <div>{provider.provider.selectedAddress}</div>}
      </main>
    </>
  );
}
