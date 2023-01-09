import { Box } from "@mui/material";
import React from "react";
import BezierCurve from "../../componets/icons/BezierCurve";

type Props = {
  blockchain: any;
};

export default function Peers({ blockchain }: Props) {
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
        <BezierCurve color="#0071e6" width="100px"></BezierCurve>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>{blockchain.peerCount}</span>
          <span>Peers</span>
        </div>
      </Box>
    </div>
  );
}
