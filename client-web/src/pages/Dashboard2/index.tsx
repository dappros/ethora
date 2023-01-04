import React from "react";
import AppsSelect from "./AppsSelect";
import Container from "@mui/material/Container";
import UsersGraph from "./UsersGraph";
import { useStoreState } from "../../store";
import UsersGraph2 from "./UsersGraph2";

type Props = {};

function Dashboard2({}: Props) {
  const apps = useStoreState((state) => state.apps);
  const [currentAppIndex, setCurrentAppIndex] = React.useState(0);
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
          <UsersGraph2></UsersGraph2>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard2;
