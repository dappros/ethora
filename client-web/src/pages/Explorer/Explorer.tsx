import React, { useEffect, useState } from "react";
import {
  getExplorerBlocks,
  getExplorerHistory,
  getTransactions,
} from "../../http";
import { useState as useStoreState } from "../../store";
import { ExplorerChart } from "./ExplorerChart";
import { format } from "date-fns";
import TransactionsTable from "../Profile/TransactionsTable";
import { ExplorerRespose, IHistory, ITransaction, TTransactions } from "../Profile/types";

export type TChartData = { date: string; y: number }[];

const transformDataForChart = (data: IHistory): TChartData => {
  const result: TChartData = [];
  for (let index = 0; index < data.x.length; index++) {
    const elementX = format(new Date(data.x[index]), "MMMM dd yyyy");
    const elementY = data.y[index];
    result.push({ date: elementX, y: elementY });
  }
  return result;
};

export const Explorer = () => {
  const user = useStoreState((store) => store.user);
  const [transactions, setTransactions] = useState<ExplorerRespose<ITransaction[]>>({
    limit: 0,
    offset: 0,
    items: [],
    total: 0,
  });
  const [explorerHistory, setExplorerHistory] = useState<TChartData | []>([]);
  const [explorerBlocks, setExplorerBlocks] = useState<
    ExplorerRespose<TChartData>
  >({ limit: 0, offset: 0, items: [], total: 0 });

  const getExplorerTransactions = async () => {
    try {
      const { data } = await getTransactions(user.walletAddress);
      const { data: history } = await getExplorerHistory();
      const { data: blocks } = await getExplorerBlocks();
      const transformedHistory = transformDataForChart(history);
      setExplorerHistory(transformedHistory);
      setTransactions(data);
      setExplorerBlocks(blocks);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getExplorerTransactions();
  }, []);
  return (
    <div>
      {!!user.token && <div style={{ width: "100vw", height: 300, padding: 20 }}>
        <ExplorerChart data={explorerHistory} />
      </div>}
      <TransactionsTable transactions={transactions.items} />
    </div>
  );
};
