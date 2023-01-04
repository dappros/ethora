import React from "react";
import Plot from "react-plotly.js";

type Props = {};

export default function TokensGraph({}: Props) {
  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Tokens
      </a>
      <Plot
        layout={{
          width: 250,
          height: 200,
          margin: { l: 40, r: 40, b: 60, t: 20, pad: 0 },
        }}
      ></Plot>
    </div>
  );
}
