import { Box, Button, Container } from "@mui/material"
import { useZustandStore } from "../../store_"
import { useState } from "react";

const IS_LOGIN_WITH_EMAIL_ON = true;

export default function AuthPage() {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const applicationConfig = useZustandStore(state => state.applicationConfig)

  return (
    <Box sx={{ backgroundColor: applicationConfig.loginBackgroundColor || "white" }}>
      <Container
        maxWidth="xl"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 68px)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ marginTop: 5 }}
          style={{
            display: "flex",
            maxWidth: "300px",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {applicationConfig.logoImage && (
            <img
              src={applicationConfig.logoImage}
              style={{ width: "100%", height: 200, marginBottom: 10 }}
            />
          )}

          {IS_LOGIN_WITH_EMAIL_ON && (
            <Button
              sx={{ margin: 1, textTransform: "none", fontSize: "16px" }}
              fullWidth
              variant="contained"
              id="regularLogin"
              onClick={() => setShowEmailModal(true)}
            >
              Sign In with E-mail
            </Button>
          )}
          {
            showEmailModal && (
              <div />
            )
          }
        </Box>
      </Container>
    </Box>
  )
}
