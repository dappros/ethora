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
import { FullPageSpinner } from "../../components/FullPageSpinner";
import ItemsTable from "./ItemsTable";
import { filterNftBalances } from "../../utils";
import { TBalance } from "../../store";
import { Button, Typography } from "@mui/material";
import DocumentsTable from "./DocumentsTable";
import * as http from "../../http";
import { Helmet } from "react-helmet";
import { appName } from "../../config/config";
import defUserImage from "../../assets/images/def-ava.png";
import { useHistory, useLocation } from "react-router";

type TProps = {
  walletAddress: string;
};

export function OtherProfile({ walletAddress }: TProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TProfile>();
  const [transactions, setTransactions] =
    useState<ExplorerRespose<ITransaction[]>>();
  const [balances, setBalances] = useState<TBalance[]>([]);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [userProfileError, setUserProfileError] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const getDocuments = async (documents: IDocument[]) => {
    const mappedDocuments = [];
    for (const item of documents) {
      try {
        // const { data: file } = await http
        //   .httpWithAuth()
        //   .get<http.IFile>("/files/" + item.files[0]);
        // item.file = file;
        item.location = item.locations[0];
        mappedDocuments.push(item);
      } catch (error) {
        console.log(item.files[0], "sdjfkls");
      }
    }
    setDocuments(mappedDocuments);
  };
  const getUserTransactions = () => {
    getTransactions(walletAddress).then((result) => {
      setTransactions(result.data);
    });
  };
  const getProfile = async () => {
    setLoading(true);
    try {
      const profile = await getPublicProfile(walletAddress);
      setProfile(profile.data);
      setBalances(profile.data.balances.balance);
      getDocuments(profile.data.documents);
    } catch (error) {
      console.log(error);
      setUserProfileError(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    getProfile();
    getUserTransactions();
  }, []);

  if (loading) {
    return <FullPageSpinner />;
  }

  if (userProfileError) {
    return (
      <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: "150px", borderRadius: "10px" }}
              width={150}
              height={150}

              alt=""
              src={defUserImage}
            />
            <Typography sx={{ fontWeight: "bold", margin: '8px 0' }}>
              User does not exist.
            </Typography>
            <Typography sx={{mb: 3}}>
              The account you are trying to access has been deleted or does not
              exist.
            </Typography>
            <Button
              onClick={() =>
                location.key ? history.goBack() : history.push("/")
              }
              variant="outlined"
            >
              Back
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
  return (
    <Container maxWidth="xl" style={{ height: "calc(100vh - 80px)" }}>
      {!!profile && (
        <Helmet>
          <title>
            {appName + ": " + profile.firstName + " " + profile.lastName}
          </title>
          <meta
            property="og:title"
            content={profile.firstName + " " + profile.lastName}
          />
          <meta name="description" content={profile.description} />
        </Helmet>
      )}
      <Box>
        {!!profile?.firstName && (
          <Box sx={{ width: "200px", margin: "auto", padding: "10px" }}>
            <UserCard profile={profile} walletAddress={walletAddress} />
          </Box>
        )}
        {!!balances.filter(filterNftBalances).length && (
          <>
            <Typography variant="h6" style={{ margin: "16px" }}>
              Items
            </Typography>
            <ItemsTable
              balance={balances.filter(filterNftBalances)}
              walletAddress={walletAddress}
            />
          </>
        )}
      </Box>
      {!!documents.length && (
        <>
          <Typography variant="h6" style={{ margin: "16px" }}>
            Documents
          </Typography>
          <DocumentsTable walletAddress={walletAddress} documents={documents} />
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
      {/* <DocumentsTable walletAddress={walletAddress} /> */}
    </Container>
  );
}
