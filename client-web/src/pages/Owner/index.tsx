import Apps from "./Apps";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import UsersTable from "../../components/UsersTable/UsersTable";
import { OwnerAlert } from "../../components/OwnerAlert";
import { useState } from "react";

export default function Owner() {
  const [showInfoAlert, setShowInfoAlert] = useState(true);
  const closeAlert = () => {
    setShowInfoAlert(false);
  };
  return (
    <div style={{ padding: "20px" }}>
      <Container maxWidth={false}>
        {showInfoAlert && (
          <Box>
            <OwnerAlert onClose={closeAlert} />
          </Box>
        )}
        <Box style={{ marginTop: "20px" }}>
          <Apps />
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <UsersTable />
        </Box>
      </Container>
    </div>
  );
}
