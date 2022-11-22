import * as React from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import * as http from "../../http";

type Props = {
  blockchain: any;
};

export default function NetworkHelth({ blockchain }: Props) {
  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <div
        style={{ width: "250px", height: "200px", backgroundColor: "white" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          {blockchain?.latestBlockNumber && (
            <CheckCircleOutlinedIcon
              style={{ fontSize: "90px", color: "green" }}
            ></CheckCircleOutlinedIcon>
          )}
          {!blockchain?.latestBlockNumber && (
            <HighlightOffOutlinedIcon
              style={{ fontSize: "90px", color: "red" }}
            ></HighlightOffOutlinedIcon>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>Network Helth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
