import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useHistory } from "react-router-dom";
import { getBalance } from "../http";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";

import { useStoreState } from "../store";
import coinImg from "../assets/images/coin.png";

function firstLetersFromName(fN: string, lN: string) {
  return `${fN[0].toUpperCase()}${lN[0].toUpperCase()}`;
}

const AppTopNavOwner = () => {
  const user = useStoreState((state) => state.owner);
  const balances = useStoreState((state) => state.balance);
  const clearOwner = useStoreState((state) => state.clearOwner);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [open, setOpen] = useState(false)
  const history = useHistory();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const mainCoinBalance = balances.find(
    (el) => el.tokenName === "Dappros Platform Token"
  );

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = () => {
    clearOwner();
    history.push("/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <NavLink style={{ color: "white" }} to="/">
              Ethora
            </NavLink>
          </Typography>

          <Box
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {mainCoinBalance ? (
              <ButtonUnstyled
                style={{
                  marginRight: "10px",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
              >
                <img
                  alt=""
                  style={{ width: "20px", height: "20px" }}
                  src={coinImg}
                ></img>
                {mainCoinBalance?.balance}
              </ButtonUnstyled>
            ) : null}
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar>
                {firstLetersFromName(user.firstName, user.lastName)}
              </Avatar>
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              anchorEl={anchorElUser}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => {history.push('/owner/create-app')}}>
                CreateApp
              </MenuItem>
              <MenuItem onClick={onLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default AppTopNavOwner;
