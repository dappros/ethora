import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { ExplorerRespose, ITransaction, TProfile } from "./types";
import UserCard from "./UserCard";
import {
  getPublicProfile,
  getTransactions,
  getBalance,
  IDocument,
} from "../../http";
import { Transactions } from "../Transactions/Transactions";
import { FullPageSpinner } from "../../componets/FullPageSpinner";
import ItemsTable from "./ItemsTable";
import { filterNftBalances } from "../../utils";
import { TBalance } from "../../store";
import { Typography } from "@mui/material";
import DocumentsTable from "./DocumentsTable";
import * as http from "../../http";

type TProps = {
  walletAddress: string;
};

export function OtherProfile(props: TProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile>();
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const [balances, setBalances] = useState<TBalance[]>([]);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const getDocuments = async (documents: IDocument[]) => {
    const mappedDocuments = [];
    for (const item of documents) {
      try {
        const { data: file } = await http
          .httpWithAuth()
          .get<http.IFile>("/files/" + item.files[0]);
        item.file = file;
        mappedDocuments.push(item);
      } catch (error) {
        console.log( item.files[0],"sdjfkls");
      }
    }
    setDocuments(mappedDocuments);
  };
  useEffect(() => {
    setLoading(true);
    getPublicProfile(props.walletAddress).then((result) => {
      setProfile(result.data);
      setBalances(result.data.balances.balance);
      getDocuments(result.data.documents);
    });
    // .finally(() => setLoading(false));
    setLoading(false);
    getTransactions(props.walletAddress).then((result) => {
      setTransactions(result.data);
    });
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      <Box>
        {!!profile?.firstName && (
          <Box sx={{ width: "200px", margin: "auto", padding: "10px" }}>
            <UserCard profile={profile} />
          </Box>
        )}
        {!!balances.filter(filterNftBalances).length && (
          <>
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
      {!!documents.length && (
        <>
          <Typography variant="h6" style={{ margin: "16px" }}>
            Documents
          </Typography>
          <DocumentsTable
            walletAddress={props.walletAddress}
            documents={documents}
          />
        </>
      )}
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
