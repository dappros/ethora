import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { TProfile } from "./types";
import defUserImage from "../../assets/images/def-ava.png";

type TProps = {
  profile: TProfile;
};

export default function UserCard({ profile }: TProps) {
  return (
    <Box style={{ marginTop: "10px", marginRight: "10px" }}>
      <Card
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "column",
          alignItems: "center",
          width: '100%'
        }}
      >
        <Box sx={{ marginRight: "10px" }}>
          <img
            style={{ width: "150px", borderRadius: "10px" }}
            alt=""
            src={profile.profileImage ? profile.profileImage : defUserImage}
          />
        </Box>
        <Box>
          <Box sx={{ fontWeight: "bold" }}>
            {profile?.firstName} {profile?.lastName}
          </Box>
          {profile?.description && (
            <Box>Description: {profile?.description}</Box>
          )}
        </Box>
      </Card>
    </Box>
  );
}
