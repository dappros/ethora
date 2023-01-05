import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { default as MuiMenu } from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";

import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { configNFT, configDocuments } from "../config/config";
import xmpp from "../xmpp";
import { useHistory } from "react-router";
import { TUser, useStoreState } from "../store";

export interface IMenu {}

const menuAccountSection = (walletAddress: string) => ({
  name: "Account",
  items: [
    {
      name: "My Profile",
      id: "/profile/" + walletAddress,
      visible: true,
    },
    { name: "Explorer", id: "/explorer", visible: false },
    { name: "Referrals", id: "/referrals", visible: true },

    {
      name: "Transactions",
      id: "/explorer/address/" + walletAddress,
      visible: false,
    },
  ],
});

const menuActionsSection = {
  name: "Actions",
  items: [
    { name: "New room", id: "/newchat", visible: true },

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
  items: [
    { name: "Privacy and Data", id: "/privacy", visible: true },
    { name: "Sign out", id: "logout", visible: true },
  ],
};

const initMenuItems = (user: TUser, ACL: any) => {
  let items = [
    menuAccountSection(user.walletAddress),
    {
      name: "Messaging",
      items: [{ name: "Chats", id: "/chat/none", visible: true }],
    },
    menuActionsSection,
    idActionsSection,
  ];

  if (ACL?.result?.application?.appUsers?.read) {
    items.push({
      name: "Users",
      items: [{ name: "Users", id: "/users", visible: true }],
    });
  }

  if (user.ACL.masterAccess) {
    items.push({
      name: "Admin",
      items: [{ name: "Statistics", id: "/statistics", visible: true }],
    });
  }

  return items;
};

export const Menu: React.FC<IMenu> = ({}) => {
  const { active, deactivate } = useWeb3React();
  const user = useStoreState((state) => state.user);
  const history = useHistory();
  const ACL = useStoreState((state) => state.ACL);
  const [menuItems, setMenuItems] = useState(initMenuItems(user, ACL));

  const clearUser = useStoreState((state) => state.clearUser);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const onLogout = () => {
    clearUser();
    xmpp.stop();
    if (active) {
      deactivate();
    }
    history.push("/");
  };

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

  useEffect(() => {
    if (user.ACL.masterAccess) {
      alert("masterAccess");
    }
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpenUserMenu}
        sx={{ p: 0, color: "white", marginRight: "20px" }}
      >
        <MenuIcon />
      </IconButton>
      <MuiMenu
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
                    <Typography textAlign="center">{item.name}</Typography>
                  </MenuItem>
                );
              })}
            </Box>
          );
        })}
      </MuiMenu>
    </>
  );
};
