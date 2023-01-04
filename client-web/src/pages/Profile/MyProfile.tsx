import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction, TProfile } from "./types";
import UserCard from "./UserCard";
import { getTransactions, getBalance } from "../../http";
import { useStoreState } from "../../store";
import ItemsTable from "./ItemsTable";
import { Transactions } from "../Transactions/Transactions";
import { Typography } from "@mui/material";
import DocumentsTable from "./DocumentsTable";
import { FullPageSpinner } from "../../componets/FullPageSpinner";
import { filterNftBalances } from "../../utils";
import { getToken } from "../../firebase";

const styles = {
  craeteNewLink: {
    textDecoration: "none",
    color: "inherit",
    fontSize: "14px",
  },
};

export function MyProfile() {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const user = useStoreState((store) => store.user);
  const items = useStoreState((state) => state.balance);
  const documents = useStoreState((state) => state.documents);
  const setBalance = useStoreState((state) => state.setBalance);

  useEffect(() => {
    console.log("MyProfile init");
    setLoading(true);
    getBalance(user.walletAddress).then((resp) => {
      setBalance(resp.data.balance);
    });
    getTransactions(user.walletAddress)
      .then((result) => {
        setTransactions(result.data);
      })
      .finally(() => setLoading(false));

    if (Notification.permission === "denied") {
      alert("Please enable notifications for this app in your browser");
    } else {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("geting token");
            getToken().then((token) => {
              console.log("my fb token ", token);
            });
            return;
          }
        });
      } else {
        console.log("geting token");
        getToken().then((token) => {
          console.log("my fb token ", token);
        });
        return;
      }
    }
  }, []);

  if (loading) return <FullPageSpinner />;
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Box sx={{ margin: "auto", width: "200px" }}>
        <UserCard />
      </Box>
      <Typography
        variant="h6"
        style={{
          margin: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Items</span>
      </Typography>
      <ItemsTable
        balance={items.filter(filterNftBalances)}
        walletAddress={user.walletAddress}
      />
      {!!documents.length && (
        <>
          <Typography
            variant="h6"
            style={{
              margin: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Documents</span>
          </Typography>
          <DocumentsTable
            walletAddress={user.walletAddress}
            documents={documents}
          />
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
