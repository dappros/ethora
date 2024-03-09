import React, { useEffect, useState } from "react"
import Container from "@mui/material/Container"
import UsersGraph from "./UsersGraph"
import AppsSelect from "./AppsSelect"
import { useStoreState } from "../../store"
import TokensGraph from "./TokensGraph"
import TransactionsGraph from "./TransactionsGraph"
import Contracts from "./Contracts"

import "./Graph.scss"
import NetworkHealth from "./NetworkHealth"
import Peers from "./Peers"
import * as http from "../../http"
import { Box } from "@mui/material"

type Properties = {}

export interface IBlockChain {
  blockTimestamp: Date | string
  latestBlockHash: string
  latestBlockNumber: number
  noOfTransactions: number
  peerCount: number
  pendingTransactions: number
  transactionDifficulty: number
}

function Dashboard() {
  const apps = useStoreState((state) => state.apps)
  const [currentAppIndex, setCurrentAppIndex] = useState(0)
  const appToken = apps[currentAppIndex]?.appToken
  const [blockchain, setBlockchain] = useState<IBlockChain>({
    blockTimestamp: "",
    latestBlockHash: "",
    latestBlockNumber: 0,
    noOfTransactions: 0,
    peerCount: 0,
    pendingTransactions: 0,
    transactionDifficulty: 0,
  })

  const getBlockchainData = async () => {
    try {
      const res = await http
        .httpWithToken(appToken)
        .get<IBlockChain>("/explorer/blockchain")
      setBlockchain(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (apps.length > 0) {
      setCurrentAppIndex(0)
    }
  }, [apps])
  useEffect(() => {
    getBlockchainData()
  }, [])

  return (
    <div style={{ backgroundColor: "#edf0f4", padding: "20px" }}>
      <Container
        maxWidth="xl"
        style={{
          width: "100%",
        }}
      >
        <AppsSelect
          apps={apps}
          currentAppIndex={currentAppIndex}
          setCurrentAppIndex={setCurrentAppIndex}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gridTemplateRows: "250px 250px",
          }}
        >
          {!!appToken && (
            <>
              {" "}
              <UsersGraph appToken={appToken} />
              <TokensGraph />
              <TransactionsGraph appToken={appToken} />
            </>
          )}
          <Box sx={{ display: "flex", width: "100%" }}>
            <Contracts appToken={appToken} />
            <NetworkHealth blockchain={blockchain} />
            <Peers blockchain={blockchain} />
          </Box>
        </Box>
      </Container>
    </div>
  )
}

export default Dashboard
