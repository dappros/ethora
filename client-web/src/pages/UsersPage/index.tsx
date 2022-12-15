import * as React from "react";
import Container from "@mui/material/Container";
import UsersTable from "../Owner/Users";
import Box from "@mui/material/Box";

export default function UsersPage() {
  return (
    <Container
      maxWidth="xl"
      style={{
        height: "calc(100vh - 68px)",
      }}
    >
      <Box style={{ marginTop: "20px" }}>
        <UsersTable></UsersTable>
      </Box>
    </Container>
  );
}
