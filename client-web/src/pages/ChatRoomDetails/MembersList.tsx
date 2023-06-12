import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { TMemberInfo, TUserChatRooms, useStoreState } from "../../store";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import xmpp from "../../xmpp";
import { walletToUsername, usernameToWallet } from "../../utils/walletManipulation";

export default function MembersList() {
  const { roomJID }: any = useParams();
  const userChatRooms = useStoreState((store) => store.userChatRooms);
  const membersList = useStoreState((store) =>
    store.roomMemberInfo.filter((item) => item.name !== "none")
  );
  const user = useStoreState((store) => store.user);
  const currentRoomData = userChatRooms.find((e) => e?.jid === roomJID);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TMemberInfo>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const roomRoles = useStoreState((state) => state.roomRoles);
  const history = useHistory();

  const currentRoomRole = roomRoles.find(
    (value) => value.roomJID === currentRoomData?.jid
  )?.role;


 
  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    setShowMenu(false);
  };

  const handleOnMemberPress = (member: TMemberInfo) => {
    if (member.jid.includes(walletToUsername(user.walletAddress))) {
      history.push("/profile/" + user.walletAddress);
    } else {
      history.push("/profile/" + usernameToWallet(member.jid.split("@")[0]));
    }
  };
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    member: TMemberInfo
  ) => {
    event.stopPropagation();
    setSelectedUser(member);
    setAnchorEl(event.currentTarget);
    setShowMenu(true);
  };
  const banUser = (
    member: TMemberInfo,
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (member.ban_status === "clear") {
      xmpp.banUserStanza(member.jid, currentRoomData.jid);
    } else {
      xmpp.unbanUserStanza(member.jid, currentRoomData.jid);
    }

    xmpp.getRoomMemberInfo(currentRoomData.jid);
    handleMenuClose(event);
  };

  return (
    <Box>
      <Typography variant="h5">Members ({membersList.length})</Typography>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {membersList.map((member) => {
          return (
            <ListItem
              dense
              onClick={() => handleOnMemberPress(member)}
              style={{ flexDirection: "row", alignItems: "center" }}
              key={member.jid}
            >
              <Box
                alignItems="center"
                justifyContent="center"
                style={{
                  background: "#003E9C",
                  width: "40px",
                  height: "40px",
                  margin: 5,
                  display: "flex",
                }}
              >
                {member.profile !== "none" ? (
                  <Avatar
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    variant="square"
                    src={member.profile}
                  />
                ) : (
                  <Typography style={{ color: "white" }}>
                    {member.name ? member.name[0] : null}
                  </Typography>
                )}
              </Box>
              <Typography>
                {member.jid.includes(walletToUsername(user.walletAddress))
                  ? "You"
                  : member.name}
              </Typography>
              {!member.jid.includes(walletToUsername(user.walletAddress)) &&
                (currentRoomRole === "moderator" ||
                  currentRoomRole === "owner") && (
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, member)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                )}
              {member.role === "owner" && (
                <Box
                  style={{
                    border: "1px solid",
                    borderWidth: 1,
                    borderRadius: 5,
                    width: "70px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                >
                  <Typography>{member.role}</Typography>
                </Box>
              )}
              {member.ban_status !== "clear" ? (
                <Box
                  style={{
                    border: "1px solid",
                    borderWidth: 1,
                    borderRadius: 5,
                    width: "70px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: 10,
                  }}
                >
                  <Typography>banned</Typography>
                </Box>
              ) : null}
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={showMenu}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    width: "20ch",
                  },
                }}
              >
                <MenuItem onClick={(event) => banUser(member, event)}>
                  {member?.ban_status === "clear" ? "Ban" : "Unban"}
                </MenuItem>
              </Menu>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
