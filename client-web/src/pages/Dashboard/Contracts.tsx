import React, { useState, useEffect } from "react";
import GavelIcon from "@mui/icons-material/Gavel";
import * as http from "../../http";
import { Box } from "@mui/material";

type Props = {
  appToken?: string;
};

export default function Contracts({ appToken }: Props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (appToken) {
      http
        .httpWithToken(appToken)
        .get("/explorer/count/contract")
        .then((response) => {
          setCount(response.data.count);
        });
    }
  }, [appToken]);

  return (
    <div
      className="dashboard-graph"
      style={{
        marginRight: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <GavelIcon
          style={{ fontSize: "90px", color: "#604020" }}
          color="inherit"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>{count}</span>
          <span>Contracts</span>
        </div>
      </Box>
    </div>
  );
}
