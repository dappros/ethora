import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material"
import * as React from "react"
import { ISharedLink } from "./ProfileShareTab"
import QrCode2Icon from "@mui/icons-material/QrCode2"
import DescriptionIcon from "@mui/icons-material/Description"
import DeleteIcon from "@mui/icons-material/Delete"
import { generateDocumentLink } from "../../utils"
import { format } from "date-fns"

interface ManageDocumentShareTabPanelProperties {
  handleChangeTab: (event: React.SyntheticEvent, newValue: number) => void
  loading: boolean
  sharedLinks: ISharedLink[]
  handleOpenModal: (documentLink: string) => void
  deleteLink: (linkToken: string) => Promise<void>
}

interface DocumentLinkItemComponentProperties {
  key: string
  linkItem: ISharedLink
  handleOpenModal: (documentLink: string) => void
  docLink: string
  deleteLink: (linkToken: string) => Promise<void>
}

export const ManageDocumentShareTabPanel = (
  properties: ManageDocumentShareTabPanelProperties
) => {
  const { handleChangeTab, loading, sharedLinks, handleOpenModal, deleteLink } =
    properties

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
        <Typography fontWeight={"bold"}>Current Document Shares</Typography>
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
        Listed below are your currently active document sharing links. You can
        share or delete them.
      </Typography>
      {loading ? <CircularProgress /> : null}

      {sharedLinks.length > 0
        ? sharedLinks.map((item, index) => {
            return (
              <LinkItemComponent
                handleOpenModal={handleOpenModal}
                key={item._id}
                linkItem={item}
                docLink={generateDocumentLink({
                  linkToken: item.token,
                })}
                deleteLink={deleteLink}
              />
            )
          })
        : null}
    </Box>
  )
}

function LinkItemComponent(properties: DocumentLinkItemComponentProperties) {
  const { linkItem, key, handleOpenModal, docLink, deleteLink } = properties
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
            {+linkItem.expiration === -1
              ? ""
              : format(new Date(linkItem.expiration), "MMMM dd yyyy hh:mm")}
          </Typography>
        </Box>

        <Box marginLeft={"50px"}>
          <IconButton onClick={() => handleOpenModal(docLink)} color="inherit">
            <QrCode2Icon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={() => navigator.clipboard.writeText(docLink)}
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
  )
}
