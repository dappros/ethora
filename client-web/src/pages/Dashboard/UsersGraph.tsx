import * as React from "react";
import Plot from "react-plotly.js";
import * as http from "../../http";

type Props = {
  apps: any[];
  currentAppIndex: number;
};

export default function UsersGraph({ apps, currentAppIndex }: Props) {
  const [userCount, setUsersCount] = React.useState(0);
  const [userGraph, setUserGraph] = React.useState({
    data: [],
    layout: {
      width: 250,
      height: 200,
      title: "",
      xaxis: { title: "Date" },
      yaxis: { title: "Users Registered" },
      margin: { l: 40, r: 40, b: 60, t: 20, pad: 0 },
    },
    config: { displayModeBar: false },
    style: {},
  });

  React.useEffect(() => {
    http
      .httpWithToken(apps[currentAppIndex].appToken)
      .get("users/count")
      .then((response) => {
        setUsersCount(response.data.count);
      });
    http
      .httpWithToken(apps[currentAppIndex].appToken)
      .get("users/graph")
      .then((response) => {
        let data = response.data;
        data.x.reverse();
        data.y.reverse();
        data.type = "sctter";
        data.mode = "lines+markers";
        data.marker = { size: 10, color: "#ff8c1a" };

        setUserGraph((oldValue) => {
          return {
            ...oldValue,
            data: [data],
          };
        });
      });
  }, [apps, currentAppIndex]);

  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Users {userCount}
      </a>
      <Plot
        data={userGraph.data}
        config={userGraph.config}
        layout={userGraph.layout}
        style={userGraph.style}
      ></Plot>
    </div>
  );
}
