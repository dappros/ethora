import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ISharedLink } from "./ProfileShareTab";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

interface ManageTabPanelProps {
  handleChangeTab: (event: React.SyntheticEvent, newValue: number) => void;
  sharedLinks: ISharedLink[];
  loading: boolean;
  handleOpenModal: () => void;
  profileLink: string;
  deleteLink: (linkToken: string) => Promise<void>;
}

interface ProfileLinkItemComponentProps {
  key: string;
  linkItem: ISharedLink;
  handleOpenModal: () => void;
  profileLink: string;
  deleteLink: (linkToken: string) => Promise<void>;
}

export const ManageTabPanel = (props: ManageTabPanelProps) => {
  const {
    handleChangeTab,
    sharedLinks,
    loading,
    handleOpenModal,
    profileLink,
    deleteLink,
  } = props;
  return (
    <Box
      style={{
        margin: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          margin: "10px",
          marginLeft: 0,
        }}
      >
        <Typography fontWeight={"bold"}>Current Profile Shares</Typography>
        <Button
          style={{
            width: "150px",
            marginLeft: "10px",
          }}
          onClick={(event) => handleChangeTab(event, 1)}
          variant="contained"
        >
          + Add a share
        </Button>
      </Box>
      <Typography>
        Listed below are your currently active profile sharing links. You can
        share or delete them.
      </Typography>
      {loading ? <CircularProgress /> : null}

      {sharedLinks.length
        ? sharedLinks.map((item, index) => {
            return (
              <LinkItemComponent
                handleOpenModal={handleOpenModal}
                key={item._id}
                linkItem={item}
                profileLink={profileLink}
                deleteLink={deleteLink}
              />
            );
          })
        : null}
    </Box>
  );
};

function LinkItemComponent(props: ProfileLinkItemComponentProps) {
  const { linkItem, key, handleOpenModal, profileLink, deleteLink } = props;
  return (
    <Box
      key={key}
      style={{
        margin: "10px",
        marginTop: "40px",
      }}
    >
      <Typography fontWeight={"bold"}>{linkItem.memo}</Typography>
      <Box
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography>
            Created at:{" "}
            {format(new Date(linkItem.createdAt), "MMMM dd yyyy, hh:mm")}
          </Typography>
          <Typography>
            Expires:{" "}
            {+linkItem.expiration !== -1
              ? format(new Date(linkItem.expiration), "MMMM dd yyyy hh:mm")
              : ""}
          </Typography>
        </Box>

        <Box marginLeft={"50px"}>
          <IconButton onClick={handleOpenModal} color="inherit">
            <QrCode2Icon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => navigator.clipboard.writeText(profileLink)}
            color="inherit"
          >
            <DescriptionIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => deleteLink(linkItem.token)}
            color="inherit"
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
