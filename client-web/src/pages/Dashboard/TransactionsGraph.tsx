import React, { useEffect, useState } from "react";
import * as http from "../../http";
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
import { CircularProgress, useTheme } from "@mui/material";
import { TChartData, transformDataForLineChart } from "../../utils";

type Props = {
  apps: any[];
  currentAppIndex: number;
};

export default function TransactionsGraph({ apps, currentAppIndex }: Props) {
  const [transactions, setTransactions] = useState<TChartData>([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const getData = async () => {
    setLoading(true);
    try {
      const res = await http
        .httpWithToken(apps[currentAppIndex].appToken)
        .get("explorer/graph");
      setTransactions(transformDataForLineChart(res.data));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [apps, currentAppIndex]);

  if (loading) {
    return (
      <div
        className="dashboard-graph"
        style={{
          marginRight: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Transactions
      </a>
      <ResponsiveContainer height={"100%"}>
        <LineChart
          width={500}
          height={300}
          data={transactions}
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
