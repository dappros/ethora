import React from "react";
import Container from "@mui/material/Container";
import UsersGraph from "./UsersGraph";
import AppsSelect from "./AppsSelect";
import { useStoreState } from "../../store";
import TokensGraph from "./TokensGraph";
import TransactionsGraph from "./TransactionsGraph";
import Contracts from "./Contracts";

import "./Graph.scss";
import { Contract } from "ethers";
import NetworkHelth from "./NetworkHelth";
import Peers from "./Peers";
import * as http from "../../http";

type Props = {};

function Dashboard({}: Props) {
  const apps = useStoreState((state) => state.apps);
  const [currentAppIndex, setCurrentAppIndex] = React.useState(0);

  React.useEffect(() => {
    if (apps.length) {
      setCurrentAppIndex(0);
    }
  }, [apps]);

  const [blockchain, setBlockchain] = React.useState<any>({});
  React.useEffect(() => {
    http
      .httpWithToken(apps[currentAppIndex].appToken)
      .get("/explorer/blockchain")
      .then((response) => {
        console.log("response", response);
        setBlockchain(response.data);
      });
  }, []);

  return (
    <div style={{ backgroundColor: "#edf0f4", padding: "20px" }}>
      <Container
        maxWidth="xl"
        style={{
          height: "calc(100vh - 68px)",
          width: "100%",
        }}
      >
        <AppsSelect
          apps={apps}
          currentAppIndex={currentAppIndex}
          setCurrentAppIndex={setCurrentAppIndex}
        ></AppsSelect>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <UsersGraph
            apps={apps}
            currentAppIndex={currentAppIndex}
          ></UsersGraph>
          <TokensGraph></TokensGraph>
          <TransactionsGraph apps={apps} currentAppIndex={currentAppIndex} />
          <Contracts apps={apps} currentAppIndex={currentAppIndex}></Contracts>
          <NetworkHelth blockchain={blockchain} />
          <Peers blockchain={blockchain}></Peers>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
