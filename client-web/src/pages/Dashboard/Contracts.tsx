import * as React from "react";
import GavelIcon from "@mui/icons-material/Gavel";
import * as http from "../../http";

type Props = {
  apps: any[];
  currentAppIndex: number;
};

export default function Contracts({ apps, currentAppIndex }: Props) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    http
      .httpWithToken(apps[currentAppIndex].appToken)
      .get("/explorer/count/contract")
      .then((response) => {
        setCount(response.data.count);
      });
  }, [apps, currentAppIndex]);
  return (
    <div
      className="dashboard-graph"
      style={{
        marginRight: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
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
          <GavelIcon
            style={{ fontSize: "90px", color: "#604020" }}
            color="inherit"
          ></GavelIcon>
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
        </div>
      </div>
    </div>
  );
}
