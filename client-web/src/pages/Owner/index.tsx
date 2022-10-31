import * as React from "react";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import Apps from "./Apps";
import Box from "@mui/material/Box";
import Users from "./Users";
import { Container } from "@mui/material";

export default function Owner() {
  const owner = useStoreState((state) => state.owner);
  const history = useHistory();
  React.useEffect(() => {
    if (!owner.firstName) {
      history.push("/");
    }
  }, [owner, history]);

  return (
    <div style={{ backgroundColor: "#edf0f4", padding: "20px" }}>
      <Container maxWidth={'lg'}>
      <Box style={{ marginTop: "20px" }}>
        <Apps />
      </Box>

      <Box style={{ marginTop: "20px" }}>
        <Users />
      </Box>
      </Container>
    </div>
  );
}
