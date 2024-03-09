import { Box, Tab, Tabs } from "@mui/material"
import * as React from "react"
import { deleteSharedLink, getSharedLinksService } from "../../http"
import { useStoreState } from "../../store"
import { generateProfileLink } from "../../utils"
import { CONFERENCEDOMAIN } from "../../constants"
import { QrModal } from "../Profile/QrModal"
import { ManageTabPanel } from "./ManageProfileTabPanel"
import { AddTabPanel } from "./AddProfileTabPanel"
import { walletToUsername } from "../../utils/walletManipulation"

interface ProfileShareTabProperties {}

export interface ISharedLink {
  _id: string
  createdAt: string
  expiration: string
  memo: string
  resource: string
  token: string
  updatedAt: string
  userId: string
  walletAddress: string
}

function a11yProperties(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

export const ProfileShareTab = (properties: ProfileShareTabProperties) => {
  const [tab, setTab] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [sharedLinks, setSharedLinks] = React.useState<ISharedLink[]>([])
  const [openModal, setOpenModal] = React.useState(false)
  const [showToast, setShowToast] = React.useState(false)
  const user = useStoreState((state) => state.user)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)
  const handleOpenToast = () => setShowToast(true)
  const handleCloseToast = () => setShowToast(false)
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const profileLink = generateProfileLink({
    firstName: user.firstName,
    lastName: user.lastName,
    walletAddress: user.walletAddress,
    xmppId: walletToUsername(user.walletAddress) + CONFERENCEDOMAIN,
    linkToken: user.token,
  })

  const getSharedLinks = async () => {
    setLoading(true)
    try {
      const { data } = await getSharedLinksService()
      setSharedLinks(data.items.filter((item) => item.resource === "profile"))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const deleteLink = async (linkToken: string) => {
    try {
      const { data } = await deleteSharedLink(linkToken)
      await getSharedLinks()
      handleOpenToast()
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
      {tab === 0 ? (
        <ManageTabPanel
          handleChangeTab={handleChangeTab}
          sharedLinks={sharedLinks}
          loading={loading}
          profileLink={profileLink}
          handleOpenModal={handleOpenModal}
          deleteLink={deleteLink}
        />
      ) : null}
      {tab === 1 ? <AddTabPanel getSharedLinks={getSharedLinks} /> : null}
      <QrModal open={openModal} link={profileLink} onClose={handleCloseModal} />
    </Box>
  )
}
