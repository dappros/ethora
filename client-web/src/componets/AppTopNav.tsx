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
import { Link, useHistory, useLocation } from "react-router-dom";
import ButtonUnstyled from "@mui/base/ButtonUnstyled";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import Snackbar from "@mui/material/Snackbar";
import Web3 from "web3";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import StarRateIcon from "@mui/icons-material/StarRate";
import { getBalance, httpWithAuth } from "../http";
import xmpp from "../xmpp";
import { TActiveRoomFilter, useStoreState } from "../store";

import coinImg from "../assets/images/coin.png";
import { TRRANSFER_TO_SUBSCRIPTION } from "../apollo/subscription";
import { Badge, Divider } from "@mui/material";
import {
  configDocuments,
  configNFT,
  defaultChats,
  defaultMetaRoom,
  ROOMS_FILTERS,
} from "../config/config";

function firstLetersFromName(fN: string, lN: string) {
  return `${fN[0].toUpperCase()}${lN[0].toUpperCase()}`;
}

const roomFilters = [
  { name: ROOMS_FILTERS.official, Icon: StarRateIcon },
  { name: ROOMS_FILTERS.private, Icon: GroupIcon },
  { name: ROOMS_FILTERS.meta, Icon: ExploreIcon },
];
const menuActionsSection = {
  name: "Actions",
  items: [
    { name: "Mint NFT", id: "/mint", visible: configNFT },
    {
      name: "Upload Document",
      id: "/documents/upload",
      visible: configDocuments,
    },
  ],
};
const idActionsSection = {
  name: "Id",
  items: [{ name: "Sign out", id: "logout", visible: true }],
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
      {
        name: "My Profile",
        id: "/profile/" + user.walletAddress,
        visible: true,
      },
      { name: "Explorer", id: "/explorer", visible: false },
      {
        name: "Transactions",
        id: "/explorer/address/" + user.walletAddress,
        visible: false,
      },
    ],
  };
  const initMenuItems = [
    menuAccountSection,
    {
      name: "Messaging",
      items: [{ name: "Chats", id: "/chat/none", visible: true }],
    },
    menuActionsSection,
    idActionsSection,
  ];
  const [menuItems, setMenuItems] = useState(initMenuItems);
  const [showMainBalanceNotification, setShowMainBalanceNotification] =
    useState(false);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const history = useHistory();
  const location = useLocation();
  const { active, deactivate } = useWeb3React();
  const balance = useStoreState((state) => state.balance);
  const mainCoinBalance = useStoreState((state) =>
    state.balance.find((el) => el.tokenName === "Dappros Platform Token")
  );
  const clearUser = useStoreState((state) => state.clearUser);
  const setBalance = useStoreState((state) => state.setBalance);
  const rooms = useStoreState((state) => state.userChatRooms);
  const setActiveRoomFilter = useStoreState(
    (state) => state.setActiveRoomFilter
  );

  const [unreadMessagesCounts, setUnreadMessagesCounts] = useState({
    official: 0,
    meta: 0,
    private: 0,
  });

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
          {
            name: "Users",
            items: [{ name: "Users", id: "/users", visible: true }],
          },
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

  const navigateToLatestMetaRoom = async () => {
    try {
      const res = await httpWithAuth().get("/room/currentRoom");
      if (!res.data.result) {
        history.push("/chat/" + defaultMetaRoom.jid);

        return;
      }
      history.push("/chat/" + res.data.result.roomId.roomJid);
    } catch (error) {
      console.log(error, "cannot navigate to room");

      // showError('Error', 'Cannot fetch latest meta room');
    }
  };

  const onLogout = () => {
    clearUser();
    xmpp.stop();
    if (active) {
      deactivate();
    }
    history.push("/");
  };
  const getCounter = () => {
    const counts = {
      official: 0,
      meta: 0,
      private: 0,
    };
    rooms.forEach((item) => {
      const splitedJid = item.jid.split("@")[0];
      if (defaultChats[splitedJid]) {
        counts.official += item.unreadMessages;
      }
      if (!defaultChats[splitedJid] && +item.users_cnt < 3) {
        counts.private += item.unreadMessages;
      }
      if (!defaultChats[splitedJid] && +item.users_cnt >= 3) {
        counts.meta += item.unreadMessages;
      }
    });

    setUnreadMessagesCounts(counts);
  };
  const onRoomFilterClick = async (filter: TActiveRoomFilter) => {
    setActiveRoomFilter(filter);
    if (filter === ROOMS_FILTERS.meta) {
      await navigateToLatestMetaRoom();
      return;
    }
    if (!location.pathname.includes("chat")) {
      history.push("/chat/none");
    }
  };

  useEffect(() => {
    getCounter();
  }, [rooms]);
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0, color: "white", marginRight: "20px" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              sx={{ mt: "20px" }}
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
              {menuItems.map((el, i) => {
                return (
                  <Box key={el.name}>
                    {i !== 0 && <Divider />}

                    <Typography
                      sx={{
                        marginLeft: "7px",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        marginY: "7px",
                      }}
                    >
                      {el.name}
                    </Typography>
                    {el.items.map((item) => {
                      if (!item.visible) {
                        return null;
                      }
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {roomFilters.map((item) => {
                return (
                  <Badge
                    key={item.name}
                    badgeContent={unreadMessagesCounts[item.name]}
                    color="secondary"
                  >
                    <IconButton
                      onClick={() =>
                        onRoomFilterClick(item.name as TActiveRoomFilter)
                      }
                      sx={{ color: "white" }}
                    >
                      <item.Icon />
                    </IconButton>
                  </Badge>
                );
              })}
            </Box>
          </Box>
          <Box style={{ marginLeft: "auto" }}>
            {!!mainCoinBalance && (
              <Link to={"/"} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    marginRight: "10px",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: "black",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingX: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <img
                    alt=""
                    style={{ width: "20px", height: "20px" }}
                    src={coinImg}
                  />
                  {mainCoinBalance?.balance}
                </Box>
              </Link>
            )}
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
