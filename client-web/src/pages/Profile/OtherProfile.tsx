import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction, TProfile } from "./types";
import UserCard from "./UserCard";
import { getPublicProfile, getTransactions, getBalance } from "../../http";
import { Transactions } from "../Transactions/Transactions";
import { FullPageSpinner } from "../../componets/FullPageSpinner";
import ItemsTable from "./ItemsTable";
import { filterNftBalances } from "../../utils";
import { TBalance } from "../../store";
import { Typography } from "@mui/material";

type TProps = {
  walletAddress: string;
};

export function OtherProfile(props: TProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile>();
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const [balances, setBalances] = useState<TBalance[]>([]);

  useEffect(() => {
    setLoading(true);
    getPublicProfile(props.walletAddress).then((result) => {
      console.log("getPublicProfile ", result.data);
      setProfile(result.data);
    });
    // .finally(() => setLoading(false));
    setLoading(false);
    getTransactions(props.walletAddress).then((result) => {
      setTransactions(result.data);
    });

    getBalance(props.walletAddress).then((result) => {
      console.log("balance ", result.data);

      setBalances(result.data.balance);
    });
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }
  console.log(balances)
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Box>
        {!!profile && (
          <Box sx={{ width: "200px", margin: "auto", padding: "10px" }}>
            <UserCard profile={profile} />
          </Box>
        )}
        {!!balances.length && (
          <>
            {" "}
            <Typography variant="h6" style={{ margin: "16px" }}>
              Items
            </Typography>
            <ItemsTable
              balance={balances.filter(filterNftBalances)}
              walletAddress={props.walletAddress}
            />
          </>
        )}
      </Box>

      {!!transactions && (
        <>
          <Typography variant="h6" style={{ margin: "16px" }}>
            Transactions
          </Typography>
          <Transactions transactions={transactions.items} />
        </>
      )}
      {/* <DocumentsTable walletAddress={props.walletAddress} /> */}
    </Container>
  );
}
