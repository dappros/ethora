import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTransactions } from "../../http";
import TransactionsTable from "../Profile/TransactionsTable";
import { ExplorerRespose, ITransaction } from "../Profile/types";

interface ITransactionAddressDetailsProps {}

export const TransactionAddressDetails: React.FC<
  ITransactionAddressDetailsProps
> = (props) => {
  const [transactions, setTransactions] = useState<
    ExplorerRespose<ITransaction[]>
  >({ items: [], total: 0, offset: 0, limit: 0 });
  const params = useParams<{ address: string }>();
  const getDetails = async () => {
    try {
      const { data } = await getTransactions(params.address);
      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.address) {
      getDetails();
    }
  }, [params]);
  return <TransactionsTable transactions={transactions.items} />;
};
