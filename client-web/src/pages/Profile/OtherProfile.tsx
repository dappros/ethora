import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction, TProfile } from "./types";
import UserCard from "./UserCard";
import { getPublicProfile, getTransactions, getBalance } from "../../http";
import OtherItems from "./OtherItemsTable";
import { Transactions } from "../Transactions/Transactions";
import { FullPageSpinner } from "../../componets/FullPageSpinner";

type TProps = {
  walletAddress: string;
};

type TBalance = {
  balance: string;
  tokenName: string;
};

export function OtherProfile(props: TProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile>();
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const [balances, setBalances] = useState<TBalance>();

  useEffect(() => {
    setLoading(true);
    getPublicProfile(props.walletAddress)
      .then((result) => {
        console.log("getPublicProfile ", result.data);
        setProfile(result.data.result);
      })
      .finally(() => setLoading(false));

    getTransactions(props.walletAddress).then((result) => {
      setTransactions(result.data);
      console.log("balance ", result.data);
    });

    getBalance(props.walletAddress).then((result) => {
      setBalances(result.data);
    });
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Box>
        {!!profile && (
          <Box sx={{ width: "200px", margin: "auto", padding: "10px" }}>
            <UserCard profile={profile} />
          </Box>
        )}
        <OtherItems walletAddress={props.walletAddress} />
      </Box>
      {!!transactions && <Transactions transactions={transactions.items} />}
    </Container>
  );
}
