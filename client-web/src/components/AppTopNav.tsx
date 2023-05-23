import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import Container from "@mui/material/Container";

import { Link, useHistory, useLocation } from "react-router-dom";

import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import StarRateIcon from "@mui/icons-material/StarRate";
import {
  getApps,
  getBalance,
  getMyAcl,
  httpWithAuth,
  subscribeForPushNotifications,
} from "../http";
import xmpp from "../xmpp";
import { TActiveRoomFilter, useStoreState } from "../store";

import { Badge, Divider } from "@mui/material";
import {
  coinsMainName,
  defaultChats,
  defaultMetaRoom,
  ROOMS_FILTERS,
} from "../config/config";
import { Menu } from "./Menu";
import { ethers } from "ethers";
import { DOMAIN } from "../constants";
import { getFirebaseMesagingToken } from "../services/firebaseMessaging";
import { walletToUsername } from "../utils/walletManipulation";
import { firebase } from "../services/firebase";

const coinImg = "/coin.png";
function firstLetersFromName(fN: string, lN: string) {
  return `${fN[0].toUpperCase()}${lN[0].toUpperCase()}`;
}

const roomFilters = [
  { name: ROOMS_FILTERS.official, Icon: StarRateIcon },
  { name: ROOMS_FILTERS.private, Icon: GroupIcon },
  { name: ROOMS_FILTERS.meta, Icon: ExploreIcon },
];

const mockAcl = {
  result: [
    {
      network: {
        netStats: {
          read: true,
          disabled: ["create", "update", "delete", "admin"],
        },
      },
      application: {
        appCreate: {
          create: true,
          disabled: ["read", "update", "delete", "admin"],
        },
        appSettings: {
          read: true,
          update: true,
          admin: true,
          disabled: ["create", "delete"],
        },
        appUsers: {
          create: true,
          read: true,
          update: true,
          delete: true,
          admin: true,
        },
        appTokens: {
          create: true,
          read: true,
          update: true,
          admin: true,
          disabled: ["delete"],
        },
        appPush: {
          create: true,
          read: true,
          update: true,
          admin: true,
          disabled: ["delete"],
        },
        appStats: {
          read: true,
          admin: true,
          disabled: ["create", "update", "delete"],
        },
      },
    },
  ],
};
const AppTopNav = () => {
  const user = useStoreState((state) => state.user);
  const apps = useStoreState((state) => state.apps);
  const userId = useStoreState((state) => state.user._id);
  const setACL = useStoreState((state) => state.setACL);
  const history = useHistory();
  const location = useLocation();
  const mainCoinBalance = useStoreState((state) =>
    state.balance.find((el) => el.tokenName === coinsMainName)
  );
  const firebaseAppId = useStoreState(
    (s) => s.config.REACT_APP_FIREBASE_APP_ID
  );

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

  const subscribeForXmppNotifications = async () => {
    try {
      const token = await getFirebaseMesagingToken();
      const res = await subscribeForPushNotifications(
        token,
        walletToUsername(user.walletAddress) + DOMAIN
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAcl = async () => {
    // setLoading(true);

    try {
      if (user?.ACL?.ownerAccess) {
        setACL(mockAcl);
        return;
      }
      const res = await getMyAcl();
      setACL({ result: res.data.result });
    } catch (error) {
      console.log(error);
    }
    // setLoading(false);
  };
  useEffect(() => {
    getAcl();
  }, [apps.length, user.walletAddress]);
  useEffect(() => {
    getBalance(user.walletAddress).then((resp) => {
      setBalance(resp.data.balance);
    });
  }, []);

  useEffect(() => {
    if (firebaseAppId) {
      subscribeForXmppNotifications();
    }
  }, [firebaseAppId]);

  useEffect(() => {
    xmpp.init(user.walletAddress, user?.xmppPassword as string);
  }, []);

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
      <Box sx={{ width: "100%", padding: "0 20px" }}>
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Menu />
              {roomFilters.map((item, i) => {
                return (
                  <Badge
                    key={i}
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
      </Box>
    </AppBar>
  );
};
export default AppTopNav;
