import { Avatar, Box, Rating, Typography } from "@mui/material"
import React from "react"

interface ReviewContentProps {}

const ReviewContent: React.FC<ReviewContentProps> = ({}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "space-evenly",
        justifyContent: "space-evenly",
        height: "100%",
        minWidth: "358px",
        gap: "100px",
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          flexDirection: "column",
          textAlign: "left",
          gap: "24px",
        }}
      >
        <Rating name="read-only" value={5} />
        <Typography>
          "The team behind Ethora has decades of experience building mobile,
          messaging and AI platforms. This engine is an amalgamation of their
          experience. I can spin up a new app within minutes, and it's
          feature-rich, engaging and production-ready from day one. Love it!"
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Avatar>J</Avatar>
          <Box>
            <Typography>James A Palmer</Typography>
            <Typography>Serial entrepreneur</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewContent
