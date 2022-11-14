import React from "react";
import Plot from "react-plotly.js";

import "./TokensGraph.scss";

type Props = {};

export default function TokensGraph({}: Props) {
  return (
    <div className="tokens-graph">
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Tokens
      </a>
      <Plot></Plot>
    </div>
  );
}
