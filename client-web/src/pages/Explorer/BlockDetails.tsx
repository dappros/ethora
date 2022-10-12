import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getExplorerBlocks } from "../../http";
import { IBlock } from "../Profile/types";
import { format } from "date-fns";
import { FullPageSpinner } from "../../componets/FullPageSpinner";
import { Typography } from "@mui/material";

interface IBlockDetailsProps {}

const keysMap: Record<string, string> = {
  difficulty: "Difficulty",
  extraData: "Extra Data",
  gasLimit: "Gas Limit",
  gasUsed: "Gas Used",
  Hash: "Hash",
  logsBloom: "Logs Bloom",
  miner: "Miner",
  mixHash: "Mix Hash",
  Nonce: "Nonce",
  number: "Block Number",
  parentHash: "Parent Hash",
  receiptsRoot: "Receipts Root",
  sha3Uncles: "Sha3Uncles",
  size: "Size",
  stateRoot: "State Root",
  timestamp: "Timestamp",
  totalDifficulty: "Total Difficulty",
  transactions: "Transactions",
  transactionsRoot: "Transactions Root",
  uncles: "Uncles",
};

export const BlockDetails: React.FC<IBlockDetailsProps> = (props) => {
  const [blockDetails, setBlockDetails] = useState<IBlock | {}>({});
  const [loading, setLoading] = useState(false);
  const params = useParams<{ blockNumber: string }>();
  const getDetails = async () => {
    setLoading(true);

    try {
      const { data } = await getExplorerBlocks(params.blockNumber);
      const result = Object.fromEntries(
        Object.entries(data).map((item) => {
          if (item[0] === "timestamp") {
            item[1] = format(new Date(item[1] * 1000), "PPpp");
          }
          return item;
        })
      );
      setBlockDetails(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params?.blockNumber) {
      getDetails();
    }
  }, [params]);
  if (loading) return <FullPageSpinner />;
  return (
    <div style={{ overflowX: "hidden" }}>
      <Typography
        variant="h4"
        style={{ paddingInline: 20, fontSize: 25, paddingTop: 20 }}
      >
        Block details: #{params.blockNumber}
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          padding: 20,
        }}
      >
        {Object.entries(blockDetails).map((item: [string, string]) => {
          return (
            <div key={item[0]}>
              <span>
                <b>{keysMap[item[0]] || item[0]}: </b>
              </span>
              <span>{item[1]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
