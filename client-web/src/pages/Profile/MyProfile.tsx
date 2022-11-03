import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction, TProfile } from "./types";
import UserCard from "./UserCard";
import { getPublicProfile, getTransactions, getBalance } from "../../http";
import { useStoreState } from "../../store";
import ItemsTable from "./ItemsTable";
import { Transactions } from "../Transactions/Transactions";
import { Typography } from "@mui/material";

type TBalance = {
  balance: string;
  tokenName: string;
};

export function MyProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile>();
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const [balances, setBalances] = useState<TBalance>();
  const user = useStoreState((store) => store.user);

  useEffect(() => {
    setLoading(true);
    getPublicProfile(user.walletAddress)
      .then((result) => {
        setProfile(result.data.result);
      })
      .finally(() => setLoading(false));

    getTransactions(user.walletAddress).then((result) => {
      setTransactions(result.data);
      console.log("balance ", result.data);
    });

    getBalance(user.walletAddress).then((result) => {
      setBalances(result.data);
    });
  }, []);

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      {loading && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ margin: "auto", width: "200px" }}>
        {!!profile && <UserCard profile={profile} />}
      </Box>
      <ItemsTable />
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
