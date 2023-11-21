import * as React from "react"
import Container from "@mui/material/Container"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import * as http from "../../http"
import { config } from "../../config"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { format } from "date-fns"
import LoadingButton from "@mui/lab/LoadingButton"
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
import { useParams } from "react-router"

interface TabPanelProperties {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(properties: TabPanelProperties) {
  const { children, value, index, ...other } = properties

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProperties(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    disableFocusRipple: true,
  }
}

const LineChartLocal = ({ data, name }: { data: any[]; name: string }) => {
  return (
    <LineChart
      height={500}
      width={900}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <Tooltip />

      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        label={{
          value: name,
          angle: -90,
          position: "left",
        }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  )
}

export default function StatisticsPage() {
  const [value, setValue] = React.useState(0)
  const [apiCount, setApiCount] = React.useState(0)
  const [sessionsCount, setSessionsCount] = React.useState(0)
  const [transactionCount, setTransactionCount] = React.useState(0)
  const [issuanceCount, setIssuenceCount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [sessionGraph, setSessionGraph] = React.useState([])
  const [apisGraph, setApisGraph] = React.useState([])
  const [transactionGraph, setTransactionGraph] = React.useState([])
  const [issuanceGraph, setIssuenceGraph] = React.useState([])

  const { appId } = useParams<{ appId: string }>()

  const [startDate, setStartDate] = React.useState(() => {
    const startDate = new Date()
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)
    return startDate.toISOString()
  })

  const [endDate, setEndDate] = React.useState(() => {
    const endDate = new Date()
    return endDate.toISOString()
  })

  const confirUrl = new URL(config.API_URL)
  const baseUrl = confirUrl.origin

  const getData = async () => {
    try {
      const { data } = await http.getGraphs(appId, startDate, endDate)
      setTransactionCount(data.transactionsCount)
      setApiCount(data.apiCallCount)
      setIssuenceCount(data.issuanceCount)
      setSessionsCount(data.sessionsCount)
      setSessionGraph(convert(data.sessions))
      setTransactionGraph(convert(data.transactions))
      setIssuenceGraph(convert(data.issuance))
      setApisGraph(convert(data.apiCalls))
    } catch {}

    function convert(data: { x: string[]; y: string[] }) {
      const converded = []

      for (const [index, value] of data.y.entries()) {
        converded.push({
          value: value,
          // name: data.x[index],
          name: format(new Date(data.x[index]), "yyyy-MM-dd"),
        })
      }

      return converded
    }
  }

  React.useEffect(() => {
    getData()
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const filterStats = async () => {
    await getData()
  }

  const onUploadCsv = async () => {
    const response = await http.httpWithAuth()({
      url: `${baseUrl}/analysis/apis-csv?startDate=${startDate}&endDate=${endDate}`,
    })

    const dataUrl = "data:text/csv," + response.data
    const filename = "api.csv"

    const link = document.createElement("a")
    link.href = dataUrl
    link.download = filename
    link.click()
  }

  return (
    <Container
      maxWidth="xl"
      style={{ height: "calc(100vh - 68px)", paddingTop: "20px" }}
    >
      <Box style={{ paddingBottom: "20px" }}>
        <Typography variant="h4">Statistics</Typography>
      </Box>
      <Box style={{ display: "flex", marginBottom: "20px" }}>
        <TextField
          id="date"
          label="From"
          type="date"
          defaultValue={format(new Date(startDate), "yyyy-MM-dd")}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            console.log(e.target.value)
            setStartDate(new Date(e.target.value).toISOString())
          }}
          style={{ paddingRight: "15px" }}
        />
        <TextField
          id="date"
          label="To"
          type="date"
          defaultValue={format(new Date(endDate), "yyyy-MM-dd")}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setEndDate(new Date(e.target.value).toISOString())}
          style={{ paddingRight: "15px" }}
        />
        <LoadingButton
          loading={loading}
          variant="outlined"
          disabled={loading}
          onClick={filterStats}
        >
          Filter Stats
        </LoadingButton>
      </Box>
      <Box sx={{ width: "100%", height: "100%" }} className="tabs-start">
        <Box>
          {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}> */}
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="fullWidth"
            centered={false}
          >
            <Tab
              label={`Sessions - ${sessionsCount}`}
              {...a11yProperties(0)}
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
            <Tab
              label={`API calls - ${apiCount}`}
              {...a11yProperties(1)}
              className="statistic-tab"
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
            <Tab
              label={`Issuence - ${issuanceCount}`}
              {...a11yProperties(2)}
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
            <Tab
              label={`Blockchain Transactions - ${transactionCount}`}
              {...a11yProperties(3)}
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChartLocal data={sessionGraph} name={"Sessions"} />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChartLocal data={apisGraph} name={"APIs"} />
          </Box>
          <Button onClick={onUploadCsv}>Upload CSV</Button>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChartLocal data={issuanceGraph} name={"Issuance"} />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChartLocal data={transactionGraph} name={"Transaction"} />
          </Box>
        </TabPanel>
      </Box>
    </Container>
  )
}
