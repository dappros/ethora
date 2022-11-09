import * as React from "react";
import Container from "@mui/material/Container";
import UsersTable from "../Owner/Users";

export default function UsersPage() {
  return (
    <Container
      maxWidth="xl"
      style={{
        height: "calc(100vh - 68px)",
      }}
    >
      <div>
        <UsersTable></UsersTable>
      </div>
    </Container>
  );
}
