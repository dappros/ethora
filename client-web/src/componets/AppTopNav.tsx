import React, { useEffect } from "react";
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
import xmpp from "../xmpp";

const pages = ["Products", "Pricing", "Blog"];

function firstLetersFromName(fN: string, lN: string) {
  return `${fN[0].toUpperCase()}${lN[0].toUpperCase()}`;
}

const menuItems = [
  { name: "Chat", id: "chat" },
  { name: "Explorer", id: "explorer" },
];
const AppTopNav = () => {
  const { active, deactivate } = useWeb3React();
  const user = useStoreState((state) => state.user);
  const balances = useStoreState((state) => state.balance);
  const clearUser = useStoreState((state) => state.clearUser);
  const setBalance = useStoreState((state) => state.setBalance);
  const history = useHistory();

  const mainCoinBalance = balances.find(
    (el) => el.tokenName === "Dappros Platform Token"
  );

  useEffect(() => {
    getBalance(user.walletAddress).then((resp) => {
      setBalance(resp.data.balance);
    });
    xmpp.init(user.walletAddress, user.xmppPassword);
  }, []);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onMenuItemClick = (id: string) => {
    history.push("/" + id);
    handleCloseUserMenu();
  };

  const onLogout = () => {
    clearUser();
    xmpp.client.stop();
    if (active) {
      deactivate();
    }
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
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {menuItems.map((item) => {
                return (
                  <MenuItem
                    onClick={() => onMenuItemClick(item.id)}
                    key={item.id}
                  >
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                );
              })}
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
export default AppTopNav;
