import React from "react";
import {
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { IBlock } from "../pages/Profile/types";
import { format } from "date-fns";
import { Link, useHistory } from "react-router-dom";

export interface IBlocksProps {
  blocks: IBlock[];
}

export const ExplorerBlocks: React.FC<IBlocksProps> = ({ blocks }) => {
  const theme = useTheme();
  const history = useHistory()
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant={"h6"} style={{fontSize: '20px'}}>
          Blocks
        </Typography>
        <Button variant="contained" onClick={() => history.push('/explorer/blocks')}>View All</Button>
      </div>
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
        style={{ maxHeight: 300, overflowY: "scroll", marginTop: 10 }}
      >
        {blocks.map((item) => {
          return (
            <Grid
              container
              justifyContent={"flex-start"}
              key={item.hash}
              style={{ marginBottom: 10, marginLeft: 15 }}
            >
              <Grid
                style={{
                  backgroundColor: "lightgrey",
                  borderRadius: 5,
                  padding: 5,
                  marginRight: 10,
                }}
                item
                xs={6}
                md={4}
                lg={4}
              >
                <Grid>
                  <Typography style={{ fontWeight: "bold", color: 'black' }}>
                    <Link to={"/explorer/block/" + item.number} style={{textDecoration: 'none',color: 'black'}}>
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
                  style={{ fontWeight: "bold" }}
                >
                  {item.transactions.length} Transactions{" "}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
