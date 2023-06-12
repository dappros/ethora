import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { FullPageSpinner } from "../../components/FullPageSpinner";
import { getTransactions } from "../../http";
import { ExplorerRespose, ITransaction } from "../Profile/types";
import { Transactions } from "../Transactions/Transactions";

interface ITransactionAddressDetailsProps {}

const TransactionAddressDetails: React.FC<ITransactionAddressDetailsProps> = (
  props
) => {
  const [transactions, setTransactions] = useState<
    ExplorerRespose<ITransaction[]>
  >({ items: [], total: 0, offset: 0, limit: 0 });
  const [loading, setLoading] = useState(false);

  const params = useParams<{ address: string }>();
  const getDetails = async () => {
    setLoading(true);
    try {
      const { data } = await getTransactions(params.address);
      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (params?.address) {
      getDetails();
    }
  }, [params]);
  return (
    <>
      {loading ? (
        <FullPageSpinner />
      ) : (
        <Box>
          <Typography variant="h4" sx={{ padding: "10px", fontSize: "25px" }}>
            Transactions from/to {params.address}
          </Typography>
          <Transactions transactions={transactions.items} />
        </Box>
      )}
    </>
  );
};
export default TransactionAddressDetails;
