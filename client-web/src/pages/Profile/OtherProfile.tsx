import * as React from "react";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {TProfile, TTransactions} from './types'
import UserCard from "./UserCard";
import { getPublicProfile, getTransactions, getBalance } from "../../http";
import TransactionsTable from './TransactionsTable'
import OtherItems from './OtherItemsTable'

type TProps = {
  walletAddress: string;
};

type TBalance = {
  balance: string,
  tokenName: string
}

export default function OtherProfile(props: TProps) {
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<TProfile>();
  const [transactions, setTransactions] = React.useState<TTransactions>();
  const [balances, setBalances] = React.useState<TBalance>()

  React.useEffect(() => {
    setLoading(true);
    getPublicProfile(props.walletAddress)
      .then((result) => {
        setProfile(result.data.result);
      })
      .finally(() => setLoading(false));

      getTransactions(props.walletAddress)
        .then((result) => {
          setTransactions(result.data)
          console.log('balance ', result.data)
        })

      getBalance(props.walletAddress)
        .then((result) => {
          setBalances(result.data)
        })
  }, []);

  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)"}}>
      {loading ? (
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
      ) : null}
      <Box>
        {profile ? <UserCard profile={profile}></UserCard> : null}
        <OtherItems walletAddress={props.walletAddress}></OtherItems>
      </Box>
      {transactions ? <TransactionsTable transactions={transactions}></TransactionsTable> : null}
    </Container>
  );
}
