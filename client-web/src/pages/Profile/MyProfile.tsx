import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction } from "./types";
import UserCard from "./UserCard";
import { getTransactions, getBalance } from "../../http";
import { useStoreState } from "../../store";
import ItemsTable from "./ItemsTable";
import { Transactions } from "../Transactions/Transactions";
import { Typography } from "@mui/material";
import DocumentsTable from "./DocumentsTable";
import { FullPageSpinner } from "../../components/FullPageSpinner";
import { filterNftBalances } from "../../utils";

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
    useState<ExplorerRespose<ITransaction[]>>({items: [], limit: 0, offset: 0, total: 0});
  const user = useStoreState((store) => store.user);
  const items = useStoreState((state) => state.balance);
  const documents = useStoreState((state) => state.documents);
  const setBalance = useStoreState((state) => state.setBalance);

  useEffect(() => {
    setLoading(true);
    getBalance(user.walletAddress).then((resp) => {
      setBalance(resp.data.balance);
    });
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
     {!!items.filter(filterNftBalances).length &&  <Typography
        variant="h6"
        style={{
          margin: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Items</span>
      </Typography>}
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

      {!!transactions.items.length && (
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
