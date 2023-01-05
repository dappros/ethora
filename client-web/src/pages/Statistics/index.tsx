import * as React from "react";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as http from "../../http";
import { config } from "../../config";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import LoadingButton from "@mui/lab/LoadingButton";
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

import "./styles.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

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
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
    disableFocusRipple: true,
  };
}

export default function StatisticsPage() {
  const [value, setValue] = React.useState(0);
  const [apiCount, setApiCount] = React.useState();
  const [sessionsCount, setSessionsCount] = React.useState();
  const [transactionCount, setTransactionCount] = React.useState();
  const [issuanceCount, setIssuenceCount] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [sessionGraph, setSessionGraph] = React.useState([]);
  const [apisGraph, setApisGraph] = React.useState([]);
  const [transactionGraph, setTransactionGraph] = React.useState([]);
  const [issuanceGraph, setIssuenceGraph] = React.useState([]);

  const [startDate, setStartDate] = React.useState(() => {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    return format(startDate, "yyyy-MM-dd");
  });

  const [endDate, setEndDate] = React.useState(() => {
    const endDate = new Date();
    return format(endDate, "yyyy-MM-dd");
  });

  const confirUrl = new URL(config.API_URL);
  const baseUrl = confirUrl.origin;

  const getCounts = async () => {
    setLoading(true);
    try {
      const sessionCountResp = await http.httpWithAuth()({
        url: `${baseUrl}/analysis/sessions-count?startDate=${startDate}&endDate=${endDate}`,
      });
      setSessionsCount(sessionCountResp.data.count);

      const transactionCountResp = await http.httpWithAuth()({
        url: `${baseUrl}/analysis/transactions-count?startDate=${startDate}&endDate=${endDate}`,
      });
      setTransactionCount(transactionCountResp.data.count);

      const issuanceCountResp = await http.httpWithAuth()({
        url: `${baseUrl}/analysis/issuance-count?startDate=${startDate}&endDate=${endDate}`,
      });
      setIssuenceCount(issuanceCountResp.data.count);

      const apisCountResp = await http.httpWithAuth()({
        url: `${baseUrl}/analysis/apis-count?startDate=${startDate}&endDate=${endDate}`,
      });
      setApiCount(apisCountResp.data.count);
    } catch (e) {
      setLoading(false);
    }
    setLoading(false);
  };

  const getGraph = async () => {
    const sessionGraphResp = await http.httpWithAuth()({
      url: `${baseUrl}/analysis/sessions-graph?startDate=${startDate}&endDate=${endDate}`,
    });
    // /analysis/apis-graph?startDate=${startDate}&endDate=${endDate}
    const apiGraphResp = await http.httpWithAuth()({
      url: `${baseUrl}/analysis/apis-graph?startDate=${startDate}&endDate=${endDate}`,
    });

    const transactionsGraphResp = await http.httpWithAuth()({
      url: `${baseUrl}/analysis/transactions-graph?startDate=${startDate}&endDate=${endDate}`,
    });

    const issuanceGraphResp = await http.httpWithAuth()({
      url: `${baseUrl}/analysis/issuance-graph?startDate=${startDate}&endDate=${endDate}`,
    });

    function convert(data) {
      let converded = [];

      for (const [index, value] of data.y.entries()) {
        converded.push({
          value: value,
          // name: data.x[index],
          name: format(new Date(data.x[index]), "yyyy-MM-dd"),
        });
      }

      return converded;
    }

    setSessionGraph(convert(sessionGraphResp.data));
    setApisGraph(convert(apiGraphResp.data));
    setTransactionGraph(convert(transactionsGraphResp.data));
    setIssuenceGraph(convert(issuanceGraphResp.data));
  };

  React.useEffect(() => {
    getCounts();
    getGraph();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const filterStats = async () => {
    await getCounts();
  };

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
          defaultValue={startDate}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => {
            console.log(e.target.value);
            setStartDate(e.target.value);
          }}
          style={{ paddingRight: "15px" }}
        />
        <TextField
          id="date"
          label="To"
          type="date"
          defaultValue={endDate}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setEndDate(e.target.value)}
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
              {...a11yProps(0)}
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
            <Tab
              label={`API calls - ${apiCount}`}
              {...a11yProps(1)}
              className="statistic-tab"
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
            <Tab
              label={`Issuence - ${issuanceCount}`}
              {...a11yProps(2)}
              style={{
                textAlign: "left",
                textTransform: "none",
                alignItems: "flex-start",
              }}
            />
            <Tab
              label={`Blockchain Transactions - ${transactionCount}`}
              {...a11yProps(3)}
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
            <LineChart
              height={500}
              width={900}
              data={sessionGraph}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Sessions",
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
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChart
              height={500}
              width={900}
              data={apisGraph}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Sessions",
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
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChart
              height={500}
              width={900}
              data={issuanceGraph}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Sessions",
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
          </Box>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Box
            className="tabpanel-box"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <LineChart
              height={500}
              width={900}
              data={transactionGraph}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{
                  value: "Sessions",
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
          </Box>
        </TabPanel>
      </Box>
    </Container>
  );
}
