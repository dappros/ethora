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
// {"success":true,"x":["2022-11-26T00:00:00.000Z","2022-11-25T00:00:00.000Z","2022-11-24T00:00:00.000Z","2022-11-23T00:00:00.000Z","2022-11-22T00:00:00.000Z"],"y":[0,3,2,0,0]}

const data = [
  {
    name: "Nov 22",
    uv: 0,
  },
  {
    name: "Nov 23",
    uv: 3,
  },
  {
    name: "Nov 24",
    uv: 2,
  },
  {
    name: "Nov 25",
    uv: 0,
  },
  {
    name: "Nov 26",
    uv: 0,
  },
];

function UsersGraph2({}: Props) {
  return (
    <div
      style={{ width: "300px", display: "flex", justifyContent: "flex-end" }}
    >
      <ResponsiveContainer>
        <LineChart
          width={250}
          height={200}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: "Users",
              angle: -90,
              position: "left",
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UsersGraph2;
