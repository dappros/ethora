import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { NavLink } from "react-router-dom"

const AppTopNavAuth = () => {
  return (
    <AppBar position="static">
      <Container
        maxWidth="xl"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="p"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* <NavLink style={{color: "white"}}  to="/">Ethora</NavLink> */}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default AppTopNavAuth
