import { AppBar, Box, Toolbar } from "@mui/material";

export default function AppTopNav() {
    return (
        <AppBar position="static">
            <Box sx={{ width: "100%", padding: "0 20px" }}>
                <Toolbar disableGutters></Toolbar>
            </Box>
        </AppBar>
    )
}