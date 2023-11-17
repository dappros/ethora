import React, { useEffect, useState } from "react"

import * as http from "../../http"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { CircularProgress, useTheme } from "@mui/material"
import { TChartData, transformDataForLineChart } from "../../utils"

type Properties = {
  appToken: string
}

export default function UsersGraph({ appToken }: Properties) {
  const [userCount, setUsersCount] = useState(0)
  const theme = useTheme()
  const [userGraphData, setUserGraphData] = useState<TChartData>([])
  const [loading, setLoading] = useState(false)

  const getUsersData = async () => {
    setLoading(true)
    try {
      const usersCount = await http.httpWithToken(appToken).get("users/count")
      setUsersCount(usersCount.data.count)
      const graphData = await http.httpWithToken(appToken).get("users/graph")
      setUserGraphData(transformDataForLineChart(graphData.data))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    if (appToken) {
      getUsersData()
    }
  }, [appToken])

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
    )
  }
  return (
    <div className="dashboard-graph" style={{ marginRight: "10px" }}>
      <a className="title" onClick={(e) => e.preventDefault()} href="/">
        Users {userCount}
      </a>
      <ResponsiveContainer height={"100%"}>
        <LineChart
          width={500}
          height={300}
          data={userGraphData}
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
            name="Users"
            dataKey="y"
            stroke={theme.palette.primary.main}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
