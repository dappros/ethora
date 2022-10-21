import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTransactionDetails } from "../../http";
import { ITransaction } from "../Profile/types";
import { format } from "date-fns";
import { FullPageSpinner } from "../../componets/FullPageSpinner";
import { Box, Typography } from "@mui/material";

interface ITransactionDetailsProps {}

const keysMap: Record<string, string> = {
  blockNumber: "Block Number",
  blockHash: "Block Hash",
  from: "From",
  to: "To",
  gas: "Gas",
  gasPrice: "Gas Price",

  hash: "Hash",
  input: "Input",
  nonce: "Nonce",
  transactionIndex: "Transaction Index",
  value: "Value",
  type: "Type",
  timestamp: "Timestamp",
  tokenName: "Token Name",
  fromFirstName: "Sender First Name",
  fromLastName: "Sender Last Name",
  toLastName: "Receiver Last Name",
  toFirstName: "Receiver First Name",
};

export const TransactionDetails: React.FC<ITransactionDetailsProps> = (
  props
) => {
  const [transactionDetails, setTransactionDetails] = useState<
    ITransaction | {}
  >({});
  const [loading, setLoading] = useState(false);
  const params = useParams<{ txId: string }>();
  const getDetails = async () => {
    setLoading(true);

    try {
      const { data } = await getTransactionDetails(params.txId);
      const result = Object.fromEntries(
        Object.entries(data)
          .filter((item) => item[0] !== "input")
          .map((item) => {
            if (item[0] === "timestamp") {
              item[1] = format(new Date(item[1]), "PPpp");
            }
            return item;
          })
      );
      setTransactionDetails(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.txId) {
      getDetails();
    }
  }, [params]);
  return (
    <>
      {loading ? (
        <FullPageSpinner />
      ) : (
        <Box>
          <Typography variant="h4" style={{ paddingInline: 20, fontSize: 25, paddingTop: 20 }}>
            Transaction details {params.txId}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              padding: '20px',
            }}
          >
            {Object.entries(transactionDetails).map(
              (item: [string, string]) => {
                return (
                  <Box key={item[0]}>
                    <span>
                      <b>{keysMap[item[0]] || item[0]}: </b>
                    </span>
                    <span>{item[1]}</span>
                  </Box>
                );
              }
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
