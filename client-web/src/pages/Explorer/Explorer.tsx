import React, { useEffect, useState } from "react";
import {
  getExplorerBlocks,
  getExplorerHistory,
  getTransactions,
} from "../../http";
import { useStoreState } from "../../store";
import { ExplorerChart } from "../../components/ExplorerChart";
import { format } from "date-fns";
import {
  ExplorerRespose,
  IBlock,
  ILineChartData,
  ITransaction,
} from "../Profile/types";
import { FullPageSpinner } from "../../components/FullPageSpinner";
import { ExplorerBlocks } from "../../components/ExplorerBlocks";
import { Box, styled, Typography } from "@mui/material";
import { Transactions } from "../Transactions/Transactions";
import { TChartData, transformDataForLineChart } from "../../utils";

const Container = styled(Box)(({ theme }) => ({
  width: "100vw",
  padding: 20,
  display: "flex",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));




export default function Explorer() {
  const user = useStoreState((store) => store.user);
  const [transactions, setTransactions] = useState<
    ExplorerRespose<ITransaction[]>
  >({
    limit: 0,
    offset: 0,
    items: [],
    total: 0,
  });
  const [explorerHistory, setExplorerHistory] = useState<TChartData | []>([]);
  const [loading, setLoading] = useState(false);
  const [explorerBlocks, setExplorerBlocks] = useState<
    ExplorerRespose<IBlock[]>
  >({ limit: 0, offset: 0, items: [], total: 0 });

  const getState = async () => {
    setLoading(true);
    try {
      const { data } = await getTransactions(user.walletAddress);
      const { data: history } = await getExplorerHistory();
      const { data: blocks } = await getExplorerBlocks();
      const transformedHistory = transformDataForLineChart(history);
      setExplorerHistory(transformedHistory);
      setTransactions(data);
      setExplorerBlocks(blocks);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getState();
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }
  return (
    <Box>
      {!!user.token && (
        <Container>
          <Box sx={{ maxWidth: 500 }}>
            <ExplorerBlocks blocks={explorerBlocks.items} />
          </Box>
          <Box sx={{ height: 300, width: "100%" }}>
            <ExplorerChart data={explorerHistory} />
          </Box>
        </Container>
      )}
      <Typography variant="h6" sx={{ margin: "16px" }}>
        Transactions
      </Typography>
      <Transactions transactions={transactions.items} />
    </Box>
  );
}
