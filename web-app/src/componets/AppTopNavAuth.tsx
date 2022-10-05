import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import {NavLink} from 'react-router-dom'

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

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
            component='p'
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <NavLink style={{color: "white"}}  to="/">Ethora</NavLink>
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default AppTopNavAuth;
