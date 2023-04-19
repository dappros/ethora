import * as React from "react";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import Apps from "./Apps";
import Box from "@mui/material/Box";
import Users from "./Users";
import { Container } from "@mui/material";
import UsersTable from "../../components/UsersTable";

export default function Owner() {
  return (
    <div style={{ backgroundColor: "#edf0f4", padding: "20px" }}>
      <Container maxWidth={"lg"}>
        <Box style={{ marginTop: "20px" }}>
          <Apps />
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <Users />
        </Box>

        {/* <Box style={{ marginTop: "20px" }}>
          <UsersTable />
        </Box> */}
      </Container>
    </div>
  );
}
