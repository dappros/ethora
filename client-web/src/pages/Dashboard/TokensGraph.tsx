import { useTheme } from "@mui/material";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {};

export default function TokensGraph({}: Props) {
  const theme = useTheme()
  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Tokens
      </a>
      <ResponsiveContainer height={"100%"}>
        <LineChart
          width={500}
          height={300}
          data={[]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey={"y"} />
          <Tooltip />
          {/* <Legend /> */}
          <Line
            type="monotone"
            name="Transactions"
            dataKey="y"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
