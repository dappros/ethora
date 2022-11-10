import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { TProfile } from "./types";
import defUserImage from "../../assets/images/def-ava.png";
import { useStoreState } from "../../store";
import EditProfileModal from "./EditProfileModal";

type TProps = {
  profile?: TProfile;
};

export default function UserCard({ profile }: TProps) {
  const [edit, setEdit] = React.useState(false);
  const user = useStoreState((state) => state.user);
  if (profile) {
    return (
      <Box style={{ marginTop: "10px", marginRight: "10px" }}>
        <Card
          sx={{
            display: "flex",
            padding: "10px",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ marginRight: "10px" }}>
            {!!profile.firstName && (
              <img
                style={{ width: "150px", borderRadius: "10px" }}
                alt=""
                src={profile.profileImage || defUserImage}
              />
            )}
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
  return (
    <Box style={{ marginTop: "10px", marginRight: "10px" }}>
      <Card
        sx={{
          display: "flex",
          padding: "10px",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ marginRight: "10px" }}>
          <img
            style={{ width: "150px", borderRadius: "10px" }}
            alt=""
            src={user.profileImage || defUserImage}
          />
        </Box>
        <Box>
          {!!user.firstName && (
            <>
              <Box sx={{ fontWeight: "bold" }}>
                {user?.firstName} {user?.lastName}
              </Box>
              {user?.description && <Box>Description: {user?.description}</Box>}
            </>
          )}
        </Box>
        {user.firstName && (
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setEdit(true);
            }}
          >
            Edit
          </a>
        )}
      </Card>
      {edit && <EditProfileModal open={edit} setOpen={setEdit} user={user} />}
    </Box>
  );
}
