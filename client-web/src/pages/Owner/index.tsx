import * as React from "react";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import * as http from "../../http";
import Apps from "./Apps";
import Box from "@mui/material/Box";
import Users from "./Users";
import { Container } from "@mui/system";

export default function Owner() {
  const owner = useStoreState((state) => state.owner);
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();
  React.useEffect(() => {
    if (!owner.firstName) {
      history.push("/");
    } else {
      setLoading(true);
      http.getApps().then((result) => {
        console.log("getApps ", result.data);
      });
    }
  }, [owner]);

  return (
    <div style={{ backgroundColor: "#edf0f4", padding: '20px' }}>
      <Container>
        <Box style={{ marginTop: "20px" }}>
          <Apps></Apps>
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <Users></Users>
        </Box>
      </Container>
    </div>
  );
}
