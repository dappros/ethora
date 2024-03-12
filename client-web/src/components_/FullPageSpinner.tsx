import { Box, CircularProgress } from "@mui/material"

export const FullPageSpinner = () => {
  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  )
}
