import React, { useEffect, useState } from "react";
import { ACL, IUser } from "../../http";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import MailIcon from "@mui/icons-material/Mail";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DiamondIcon from '@mui/icons-material/Diamond';

import {
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { dateToHumanReadableFormat } from "../../utils";
import { useStoreState } from "../../store";

const metamaskIcon = 'https://images.ctfassets.net/9sy2a0egs6zh/2XUXAYxxFFVjPlZABUoiLg/d0ff82237d3e5d9bd1097a98e0754453/MMI-icon.svg'
const MetamaskImage = () => {
  return <img src={metamaskIcon} style={{width: 20, height: 20}} />
}
const icons = {
  google: GoogleIcon,
  facebook: FacebookIcon,
  email: MailIcon,
  metamask: MetamaskImage
};

const authMethodText = {
  google: "Google",
  facebook: "Facebook",
  email: "E-Mail",
  metamask: 'Metamask'
};

function hasACLAdmin(acl: ACL): boolean {
  const application = acl?.application;
  if (application) {
    const appKeys = Object.keys(application);
    let hasAdmin = false;
    for (let i = 0; i < appKeys.length; i++) {
      if (application[appKeys[i]]?.admin === true) {
        hasAdmin = true;
        break;
      }
    }
    return hasAdmin;
  }
  return false;
}

const ITEM_HEIGHT = 48;

export interface IUsersTableRow {
  data: IUser;
  isSelected: (id: string) => boolean;
  onRowClick: (event: React.MouseEvent<unknown>, user: IUser) => void;
  updateAclEditData: (user: IUser) => void;
}

export const UsersTableRow: React.FC<IUsersTableRow> = ({
  data,
  isSelected,
  onRowClick,
  updateAclEditData,
}) => {
  const authMethod = data.authMethod;
  const AuthIcon = icons[authMethod];
  const isItemSelected = isSelected(data._id.toString());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasAdmin, setHasAdmin] = useState(false);
  const ACL = useStoreState((state) =>
    state.ACL.result.find((i) => i.appId === data.appId)
  );
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAclEditOpen = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    user: IUser
  ) => {
    e.stopPropagation();
    updateAclEditData(user);
    handleMenuClose();
  };

  useEffect(() => {
    setHasAdmin(hasACLAdmin(ACL));
  }, [ACL]);
  const labelId = `Users-table-checkbox-${data._id}`;
  return (
    <TableRow
      hover
      onClick={(event) => onRowClick(event, data)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={data._id}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{
            "aria-labelledby": labelId,
          }}
        />
      </TableCell>

      <TableCell align="center">{data.firstName}</TableCell>
      <TableCell align="center">{data.lastName}</TableCell>
      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {data.tags.map((tag, i) => {
            return (
              <Chip variant={"filled"} color="primary" label={tag} key={i} />
            );
          })}
        </Box>
      </TableCell>
      <TableCell align="right">{data.email || "No Email"}</TableCell>
      <TableCell align="right">
        <p style={{ maxWidth: 200 }}>
          {dateToHumanReadableFormat(data.createdAt)}
        </p>
        <p>{data.lastSeen ? dateToHumanReadableFormat(data.lastSeen) : ""}</p>
      </TableCell>
      <TableCell align="center" color="primary">
        <Tooltip title={authMethod ? authMethodText[authMethod] : ''}>
          <span>{authMethod ? <AuthIcon color={"primary"} /> : ""}</span>
        </Tooltip>
      </TableCell>
      <TableCell align="right">
        <IconButton
          disabled={!hasAdmin}
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
              boxShadow: "5px 5px 10px 0px rgba(0,0,0,0.05)",
            },
          }}
        >
          <MenuItem onClick={(e) => handleAclEditOpen(e, data)}>
            Edit ACL
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};
