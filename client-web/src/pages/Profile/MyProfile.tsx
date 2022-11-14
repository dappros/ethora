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
import DocumentsCreateModal from "./DocumentsCreateModal";
import NewItemModal from "./NewItemModal";

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
  const [showCreateDocument, setShowCreateDocument] = useState(false);
  const [showCreateNewItem, setShowCreateNewItem] = useState(false);

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
        <a
          href="/"
          style={styles.craeteNewLink}
          onClick={(e) => {
            e.preventDefault();
            setShowCreateNewItem(true);
          }}
        >
          Create New Item
        </a>
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
            <a
              href="/"
              style={styles.craeteNewLink}
              onClick={(e) => {
                e.preventDefault();
                setShowCreateDocument(true);
              }}
            >
              Create New Document
            </a>
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

      {showCreateDocument && (
        <DocumentsCreateModal
          open={showCreateDocument}
          setOpen={setShowCreateDocument}
          setDocuments={() => {}}
        />
      )}

      {showCreateNewItem && (
        <NewItemModal open={showCreateNewItem} setOpen={setShowCreateNewItem} />
      )}
    </Container>
  );
}
