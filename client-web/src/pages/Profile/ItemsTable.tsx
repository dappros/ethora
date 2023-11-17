import React from "react"

import { TBalance } from "../../store"
import {
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
  Box,
} from "@mui/material"
import { produceNfmtItems } from "../../utils"
import { NFMT_TRAITS } from "../../constants"
import { useHistory } from "react-router"

const NftItem = ({
  item,
  walletAddress,
}: {
  item: TBalance
  walletAddress: string
}) => {
  const theme = useTheme()
  const history = useHistory()
  const onItemClick = () => {
    history.push({
      pathname: "/provenance",
      state: { nftItem: item, walletAddress },
    })
  }
  return (
    <ListItem key={item.nftId}>
      <ListItemButton onClick={onItemClick}>
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
          <span style={{ textAlign: "left", width: 50 }}>
            {item.balance}/{item.total}
          </span>
        </Box>
      </ListItemButton>
    </ListItem>
  )
}
const NfmtItem = ({
  item,
  walletAddress,
}: {
  item: TBalance
  walletAddress: string
}) => {
  const theme = useTheme()
  const history = useHistory()
  const onItemClick = () => {
    history.push({
      pathname: "/provenance",
      state: { nftItem: item, walletAddress },
    })
  }
  return (
    <ListItem key={item.nftId}>
      <ListItemButton onClick={onItemClick}>
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
            justifyContent: "flex-end",
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
              return NFMT_TRAITS[trait] ? (
                <Chip
                  sx={{
                    backgroundColor: NFMT_TRAITS[trait].color,
                    marginRight: "5px",
                  }}
                  label={trait}
                  key={trait}
                />
              ) : null
            })}
          </Box>
          <span style={{ textAlign: "left", width: 50 }}>
            {item.balance}/{item.total}
          </span>
        </Box>
      </ListItemButton>
    </ListItem>
  )
}

export default function ItemsTable({
  balance,
  walletAddress,
}: {
  balance: TBalance[]
  walletAddress: string
}) {
  const nftItems = balance.filter((item) => item.tokenType === "NFT")
  const nfmtItems = produceNfmtItems(balance)

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {nftItems.map((item, index) => {
        return (
          <NftItem walletAddress={walletAddress} item={item} key={item.nftId} />
        )
      })}
      {nfmtItems.map((item, index) => {
        return (
          <NfmtItem
            walletAddress={walletAddress}
            item={item}
            key={item.nftId + index}
          />
        )
      })}
    </List>
  )
}
