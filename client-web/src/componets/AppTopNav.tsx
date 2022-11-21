import React, { useEffect, useState } from "react";
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
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import Snackbar from "@mui/material/Snackbar";
import Web3 from "web3";

import { getBalance } from "../http";
import xmpp from "../xmpp";
import { useStoreState } from "../store";

import coinImg from "../assets/images/coin.png";
import { TRRANSFER_TO_SUBSCRIPTION } from "../apollo/subscription";

function firstLetersFromName(fN: string, lN: string) {
  return `${fN[0].toUpperCase()}${lN[0].toUpperCase()}`;
}
const menuActionsSection = {
  name: "Actions",
  items: [
    { name: "Mint NFT", id: "/mint" },
    { name: "Upload Document", id: "/documents/upload" },
    { name: "Sign out", id: "logout" },
  ],
};

const AppTopNav = () => {
  const currentUntrackedChatRoom = useStoreState(
    (store) => store.currentUntrackedChatRoom
  );
  const chatUrl = currentUntrackedChatRoom
    ? String(currentUntrackedChatRoom.split("@")[0])
    : "none";
  const user = useStoreState((state) => state.user);

  const menuAccountSection = {
    name: "Account",
    items: [
      { name: "My Profile", id: "/profile/" + user.walletAddress },
      { name: "Explorer", id: "/explorer" },
      { name: "Transactions", id: "/explorer/address/" + user.walletAddress },
    ],
  };
  const initMenuItems = [
    {
      name: "",
      items: [{ name: "Chat", id: "/chat/" + chatUrl }],
    },
    menuAccountSection,
    menuActionsSection,
  ];
  const [menuItems, setMenuItems] = useState(initMenuItems);
  const [showMainBalanceNotification, setShowMainBalanceNotification] =
    useState(false);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const history = useHistory();
  const { active, deactivate } = useWeb3React();
  const balance = useStoreState((state) => state.balance);
  const mainCoinBalance = useStoreState((state) =>
    state.balance.find((el) => el.tokenName === "Dappros Platform Token")
  );
  const clearUser = useStoreState((state) => state.clearUser);
  const setBalance = useStoreState((state) => state.setBalance);
  const ACL = useStoreState((state) => state.ACL);
  const { data, loading } = useSubscription(TRRANSFER_TO_SUBSCRIPTION, {
    variables: {
      walletAddress: user.walletAddress,
      contractAddress: mainCoinBalance ? mainCoinBalance.contractAddress : "",
    },
    skip: mainCoinBalance ? false : true,
  });

  useEffect(() => {
    getBalance(user.walletAddress).then((resp) => {
      setBalance(resp.data.balance);
    });

    if (ACL?.result?.application?.appUsers?.read) {
      setMenuItems((items) => {
        return [
          ...items,
          { name: "Users", items: [{ name: "Users", id: "/users" }] },
        ];
      });
    }
  }, []);

  useEffect(() => {
    if (data) {
      const ethersAmounnt = Web3.utils.fromWei(data.transferTo.amount);
      const newMainBalance = {
        ...mainCoinBalance,
        balance: Number(mainCoinBalance.balance) + Number(ethersAmounnt),
      };

      const newBalance = balance.map((el) => {
        if (el.tokenName === "Dappros Platform Token") {
          return newMainBalance;
        }

        return el;
      });

      setBalance(newBalance);
      setShowMainBalanceNotification(true);
      setTimeout(() => {
        setShowMainBalanceNotification(false);
      }, 4000);
    }
  }, [data]);

  useEffect(() => {
    xmpp.init(user.walletAddress, user?.xmppPassword as string);
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const onMenuItemClick = (id: string, type: string) => {
    if (id === "logout") {
      onLogout();
      handleCloseUserMenu();
      return;
    }

    history.push(id);

    handleCloseUserMenu();
  };

  const onLogout = () => {
    clearUser();
    xmpp.stop();
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
            sx={{
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
                />
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
              {menuItems.map((el) => {
                console.log(el.name);
                return (
                  <Box key={el.name}>
                    <Typography
                      sx={{
                        marginLeft: "5px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        marginY: "5px",
                      }}
                    >
                      {el.name}
                    </Typography>
                    {el.items.map((item) => {
                      return (
                        <MenuItem
                          onClick={() => onMenuItemClick(item.id, el.name)}
                          key={item.id + item.name}
                        >
                          <Typography textAlign="center">
                            {item.name}
                          </Typography>
                        </MenuItem>
                      );
                    })}
                  </Box>
                );
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      {showMainBalanceNotification && (
        <Snackbar
          open={true}
          message={`You get ${Web3.utils.fromWei(
            data.transferTo.amount
          )} coins from ${data.transferTo.senderFirstName} ${
            data.transferTo.senderLastName
          }`}
        />
      )}
    </AppBar>
  );
};
export default AppTopNav;
