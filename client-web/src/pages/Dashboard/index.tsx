import React from "react";
import Container from "@mui/material/Container";
import UsersGraph from "./UsersGraph";
import AppsSelect from "./AppsSelect";
import { useStoreState } from "../../store";
import TokensGraph from "./TokensGraph";

type Props = {};

function Dashboard({}: Props) {
  const apps = useStoreState((state) => state.apps);
  const [currentAppIndex, setCurrentAppIndex] = React.useState(0);

  React.useEffect(() => {
    if (apps.length) {
      setCurrentAppIndex(0);
    }
  }, [apps]);

  return (
    <div style={{ backgroundColor: "#edf0f4", padding: "20px" }}>
      <Container maxWidth="xl" style={{ height: "calc(100vh - 68px)" }}>
        <AppsSelect
          apps={apps}
          currentAppIndex={currentAppIndex}
          setCurrentAppIndex={setCurrentAppIndex}
        ></AppsSelect>
        <div style={{ display: "flex" }}>
          <UsersGraph
            apps={apps}
            currentAppIndex={currentAppIndex}
          ></UsersGraph>
          <TokensGraph></TokensGraph>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
