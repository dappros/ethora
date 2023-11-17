import React from "react"
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import { IBlock } from "../pages/Profile/types"
import { format } from "date-fns"
import { Link, useHistory } from "react-router-dom"

export interface IBlocksProperties {
  blocks: IBlock[]
}

export const ExplorerBlocks: React.FC<IBlocksProperties> = ({ blocks }) => {
  const theme = useTheme()
  const history = useHistory()
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant={"h6"} style={{ fontSize: "20px" }}>
          Blocks
        </Typography>
        <Button
          variant="contained"
          onClick={() => history.push("/explorer/blocks")}
        >
          View All
        </Button>
      </Box>
      <div
        style={{
          height: 2,
          backgroundColor: theme.palette.primary.main,
          margin: "5px 0",
          borderRadius: 5,
        }}
      />

      <Grid
        container
        spacing={2}
        sx={{ maxHeight: 300, overflowY: "scroll", marginTop: "10px" }}
      >
        {blocks.map((item) => {
          return (
            <Grid
              container
              justifyContent={"flex-start"}
              key={item.hash}
              sx={{ marginBottom: "10px", marginLeft: "15px" }}
            >
              <Grid
                sx={{
                  backgroundColor: "lightgrey",
                  borderRadius: 5,
                  padding: "5px",
                  marginRight: 10,
                }}
                item
                xs={6}
                md={4}
                lg={4}
              >
                <Grid>
                  <Typography sx={{ fontWeight: "bold", color: "black" }}>
                    <Link
                      to={"/explorer/block/" + item.number}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      Block {item.number}
                    </Link>
                  </Typography>
                  <Typography>
                    {format(new Date(item.timestamp * 1000), "PPpp")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Typography fontSize={14} color={"primary"}>
                  Miner {item.miner}
                </Typography>
                <Typography
                  fontSize={14}
                  color={"primary"}
                  sx={{ fontWeight: "bold" }}
                >
                  {item.transactions.length} Transactions{" "}
                </Typography>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
