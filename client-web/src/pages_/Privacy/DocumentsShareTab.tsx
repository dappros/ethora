import { Tab, Tabs } from "@mui/material"
import { Box } from "@mui/system"
import * as React from "react"
import { useSnackbar } from "../../context/SnackbarContext"
import { deleteSharedLink, getSharedLinksService } from "../../http"
import { useStoreState } from "../../store"
import { QrModal } from "../Profile/QrModal"
import { AddDocumentTabPanel } from "./AddDocumentTabPanel"
import { ManageDocumentShareTabPanel } from "./ManageDocumentShareTabPanel"
import { ISharedLink } from "./ProfileShareTab"

interface DocumentsShareProperties {}

function a11yProperties(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export const DocumentsShare = (properties: DocumentsShareProperties) => {
  const [tab, setTab] = React.useState(0)
  const [openModal, setOpenModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [sharedLinks, setSharedLinks] = React.useState<ISharedLink[]>([])
  const [documentLink, setDocumentLink] = React.useState("")
  const user = useStoreState((state) => state.user)
  const { showSnackbar } = useSnackbar()
  const handleCloseModal = () => setOpenModal(false)
  const handleOpenModal = (link: string) => {
    setDocumentLink(link)
    setOpenModal(true)
  }
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const getSharedLinks = async () => {
    setLoading(true)
    try {
      const { data } = await getSharedLinksService()
      setSharedLinks(data.items.filter((item) => item.resource === "document"))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const deleteLink = async (linkToken: string) => {
    try {
      const { data } = await deleteSharedLink(linkToken)
      await getSharedLinks()
      showSnackbar("success", "Link deleted successfully")
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getSharedLinks()
  }, [])

  return (
    <Box>
      <Tabs
        style={{ display: "flex" }}
        value={tab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Manage" {...a11yProperties(0)} />
        <Tab label="Add" {...a11yProperties(1)} />
      </Tabs>
      {tab === 0 && (
        <ManageDocumentShareTabPanel
          handleChangeTab={handleChangeTab}
          sharedLinks={sharedLinks}
          loading={loading}
          handleOpenModal={handleOpenModal}
          deleteLink={deleteLink}
        />
      )}
      {tab === 1 && <AddDocumentTabPanel getSharedLinks={getSharedLinks} />}
      <QrModal
        open={openModal}
        link={documentLink}
        onClose={handleCloseModal}
      />
    </Box>
  )
}
