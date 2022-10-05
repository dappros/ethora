import * as React from "react";
import Container from "@mui/material/Container";
import Card from '@mui/material/Card';
import Box from "@mui/material/Box";
import {TProfile} from './types';
import defUserImage from "../../assets/images/def-ava.png";

type TProps = {
  profile: TProfile
}

export default function UserCard({profile}: TProps) {
  return (
    <Box style={{ marginTop: "10px", marginRight: "10px" }}>
      <Card sx={{ display: "inline-flex", padding: "10px" }}>
        <Box>
          <img style={{ width: "150px" }} alt="" src={defUserImage}></img>
        </Box>
        <Box>
          <Box>First Name: {profile?.firstName}</Box>
          <Box>Last Name: {profile?.lastName}</Box>
          <Box>Description: {profile?.description}</Box>
        </Box>
      </Card>
    </Box>
  );
}
