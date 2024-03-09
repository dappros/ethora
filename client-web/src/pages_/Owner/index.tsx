import Apps from "./Apps"
import Box from "@mui/material/Box"
import { Container } from "@mui/material"
import UsersTable from "../../components/UsersTable/UsersTable"
import { OwnerAlert } from "../../components/OwnerAlert"
import { useState } from "react"

export default function Owner() {
  const [showInfoAlert, setShowInfoAlert] = useState(true)
  const [currentApp, setCurrentApp] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

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
          <Apps
            onRowClick={setCurrentApp}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setCurrentAppName={setCurrentApp}
          />
        </Box>
        {!isLoading && currentApp && (
          <Box style={{ marginTop: "20px" }}>
            <UsersTable currentApp={currentApp} onAppChange={setCurrentApp} />
          </Box>
        )}
      </Container>
    </div>
  )
}
