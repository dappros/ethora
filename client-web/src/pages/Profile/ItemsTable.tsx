import React, { useState, useRef } from "react";

import { useStoreState } from "../../store";

import { Box } from "@mui/system";

import * as http from "../../http";

import { TBalance } from "../../store";
import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
} from "@mui/material";
import { produceNfmtItems } from "../../utils";
import { NFMT_TRAITS } from "../../constants";

const NftItem = ({ item }: { item: TBalance }) => {
  const theme = useTheme();
  const walletAddress = useStoreState((state) => state.user.walletAddress);

  return (
    <ListItem key={item.nftId}>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar
            style={{ backgroundColor: theme.palette.primary.main }}
            src={item.imagePreview}
          />
        </ListItemAvatar>
        <ListItemText primary={item.tokenName} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>
            {item.balance}/{item.total}
          </span>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};
const NfmtItem = ({ item }: { item: TBalance }) => {
  const theme = useTheme();
  return (
    <ListItem key={item.nftId}>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar
            style={{ backgroundColor: theme.palette.primary.main }}
            src={item.nftFileUrl}
          />
        </ListItemAvatar>
        <ListItemText primary={item.tokenName} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              // marginRight: "10px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {item.traits.map((trait) => {
              return (
                <Chip
                  sx={{
                    backgroundColor: NFMT_TRAITS[trait].color,
                    marginRight: "5px",
                  }}
                  label={trait}
                  key={trait}
                />
              );
            })}
          </Box>
          <span style={{ textAlign: "left" }}>
            {item.balance}/{item.total}
          </span>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};



export default function ItemsTable({balance}: {balance: TBalance[]}) {
  
  const nftItems = balance.filter((item) => item.tokenType === "NFT");
  const nfmtItems = produceNfmtItems(balance);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {nftItems.map((item) => {
        return <NftItem item={item} key={item.balance} />;
      })}
      {nfmtItems.map((item) => {
        return <NfmtItem item={item} key={item.balance} />;
      })}
    </List>
  );
}
