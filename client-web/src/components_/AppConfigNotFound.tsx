import { Box, Typography } from "@mui/material";

export function AppConfigNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Typography sx={{ fontWeight: "bold", fontSize: "24px" }}>
        Error, App not found
      </Typography>
    </Box>
  )
}