import Apps from "./Apps";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import UsersTable from "../../components/UsersTable/UsersTable";

export default function Owner() {
  return (
    <div style={{ padding: "20px" }}>
      <Container maxWidth={false}>
        <Box style={{ marginTop: "20px" }}>
          <Apps />
        </Box>

        {/* <Box style={{ marginTop: "20px" }}>
          <Users />
        </Box> */}

        <Box style={{ marginTop: "20px" }}>
          <UsersTable />
        </Box>
      </Container>
    </div>
  );
}
