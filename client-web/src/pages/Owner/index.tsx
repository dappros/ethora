import Apps from "./Apps"
import Box from "@mui/material/Box"
import { Container } from "@mui/material"
import UsersTable from "../../components/UsersTable/UsersTable"
import { OwnerAlert } from "../../components/OwnerAlert"
import { useState } from "react"
import { useStoreState } from "../../store"

export default function Owner() {
  const [showInfoAlert, setShowInfoAlert] = useState(true)
  const apps = useStoreState((state) => state.apps)
  const [currentApp, setCurrentApp] = useState<string>(apps[0]?._id)

  const closeAlert = () => {
    setShowInfoAlert(false)
  }
  return (
    <div style={{ padding: "20px" }}>
      <Container maxWidth={false}>
        {showInfoAlert && (
          <Box>
            <OwnerAlert onClose={closeAlert} />
          </Box>
        )}
        <Box style={{ marginTop: "20px" }}>
          <Apps onRowClick={setCurrentApp} />
        </Box>

        <Box style={{ marginTop: "20px" }}>
          <UsersTable currentApp={currentApp} onAppChange={setCurrentApp} />
        </Box>
      </Container>
    </div>
  )
}
