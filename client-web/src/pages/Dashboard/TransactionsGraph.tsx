import * as React from "react";
import Plot from "react-plotly.js";
import * as http from "../../http";

type Props = {
  apps: any[];
  currentAppIndex: number;
};

export default function TransactionsGraph({ apps, currentAppIndex }: Props) {
  const [transactions, setTransactions] = React.useState({
    data: [],
    layout: {
      width: 250,
      height: 200,
      title: "",
      xaxis: { title: "Date" },
      yaxis: { title: "Transaction Count" },
      margin: { l: 40, r: 40, b: 60, t: 20, pad: 0 },
    },
    config: { displayModeBar: false },
    style: {},
  });

  React.useEffect(() => {
    http
      .httpWithToken(apps[currentAppIndex].appToken)
      .get("explorer/graph")
      .then((response) => {
        // data.x.reverse();
        // data.y.reverse();
        // data.type = "sctter";
        // data.mode = "lines+markers";
        // data.marker = { size: 10 };
        // this.transGraph.data = [];
        // this.transGraph.data.push(data);
        setTransactions((oldState) => {
          let data = response.data;
          data.x.reverse();
          data.y.reverse();
          data.mode = "lines+markers";
          data.marker = { size: 10 };
          console.log(data);
          return {
            ...oldState,
            data: [data],
          };
        });
      });
  }, [apps, currentAppIndex]);
  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Transactions
      </a>
      <Plot
        layout={transactions.layout}
        data={transactions.data}
        config={transactions.config}
      ></Plot>
    </div>
  );
}
