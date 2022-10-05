import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

import { getBalance } from "../../http";

type TProps = {
  walletAddress: string;
};

type TNftBalance = {
  tokenName: string;
  balance: number | string;
  total: number;
  imagePreview: string;
  contractTokenIds: string[];
  nftId: string;
  tokenType: "NFT";
  nftFileUrl: string;
  nftMetaUrl: string;
  nftOriginalname: string;
  nftMimetype: string;
  createdAt: string;
  updatedAt: string;
  contractAddress: string;
};

type TBalances = TNftBalance[];

export default function OtherItems(props: TProps) {
  const [balances, setBalances] = React.useState<TBalances>();
  React.useEffect(() => {
    if (props.walletAddress) {
      getBalance(props.walletAddress).then((response) => {
        setBalances(response.data.balance);
      });
    }
  }, [props.walletAddress]);

  if (!balances) {
    return null;
  } else {
    return (
      <Box style={{marginTop: '10px'}}>
        <Typography variant="h6">Items</Typography>
        <Box>
          {balances
            .filter((el): el is TNftBalance => el?.tokenType === "NFT")
            .map((el) => {
              return (
                <Box key={el.contractAddress}>
                  <Box>
                    <img alt="" src={el.imagePreview}></img>
                  </Box>
                  <Box>{el.tokenName}</Box>
                </Box>
              )
            })}
        </Box>
      </Box>
    );
  }
}
