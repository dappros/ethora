import React from "react"
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined"
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined"
import { Box } from "@mui/material"
import { IBlockChain } from "."

type Properties = {
  blockchain: IBlockChain
}

export default function NetworkHealth({ blockchain }: Properties) {
  return (
    <div
      className="dashboard-graph"
      style={{ marginRight: "10px", width: "100%" }}
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
        {!!blockchain?.latestBlockNumber && (
          <CheckCircleOutlinedIcon
            style={{ fontSize: "90px", color: "green" }}
          />
        )}
        {!blockchain?.latestBlockNumber && (
          <HighlightOffOutlinedIcon
            style={{ fontSize: "90px", color: "red" }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Network Health</span>
        </div>
      </Box>
    </div>
  )
}
