import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction, TProfile } from "./types";
import UserCard from "./UserCard";
import { getPublicProfile, getTransactions, getBalance } from "../../http";
import { useStoreState } from "../../store";
import ItemsTable from "./ItemsTable";
import { Transactions } from "../Transactions/Transactions";
import { Typography } from "@mui/material";
import DocumentsTable from "./DocumentsTable";
import { FullPageSpinner } from "../../componets/FullPageSpinner";
import { filterNftBalances } from "../../utils";

type TBalance = {
  balance: string;
  tokenName: string;
};

export function MyProfile() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const user = useStoreState((store) => store.user);
  const items = useStoreState((state) => state.balance);
  const documents = useStoreState((state) => state.documents);

  useEffect(() => {
    setLoading(true);
    getTransactions(user.walletAddress)
      .then((result) => {
        setTransactions(result.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Box sx={{ margin: "auto", width: "200px" }}>
        <UserCard />
      </Box>
      <Typography variant="h6" style={{ margin: "16px" }}>
        Items
      </Typography>
      <ItemsTable balance={items.filter(filterNftBalances)} />
      {!!documents.length && (
        <>
          <Typography variant="h6" style={{ margin: "16px" }}>
            Documents
          </Typography>
          <DocumentsTable documents={documents} />
        </>
      )}

      {!!transactions && (
        <Box>
          <Typography variant="h6" style={{ margin: "16px" }}>
            Transactions
          </Typography>
          <Transactions transactions={transactions.items} />
        </Box>
      )}
    </Container>
  );
}
