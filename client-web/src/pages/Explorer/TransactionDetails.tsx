import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTransactionDetails } from "../../http";
import TransactionsTable from "../Profile/TransactionsTable";
import { ITransaction } from "../Profile/types";

interface ITransactionDetailsProps {}

export const TransactionDetails: React.FC<ITransactionDetailsProps> = (props) => {
  const [transactionDetails, setTransactionDetails] = useState<ITransaction[]>([]);
  const params = useParams<{ txId: string }>();
  const getDetails = async () => {
    try {
      const { data } = await getTransactionDetails(params.txId);
     setTransactionDetails([{...data, transactionHash: params.txId}])
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.txId) {
      getDetails();
    }
  }, [params]);
  return <TransactionsTable transactions={transactionDetails} />;
};
