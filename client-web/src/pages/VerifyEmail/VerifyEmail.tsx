import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router";
import { httpWithToken } from "../../http";
import { config } from "../../config";
import { useSnackbar } from "../../context/SnackbarContext";
import { FullPageSpinner } from "../../components/FullPageSpinner";

export interface IVerifyEmail {}

export const VerifyEmail: React.FC<IVerifyEmail> = ({}) => {
  const { token } = useParams<{ token: string }>();
  const [isEmailVerified, setEmailVerified] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();
  const { showSnackbar } = useSnackbar();

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const res = await httpWithToken(config.APP_JWT).put(
        "/users/verifyEmail",
        { token }
      );
      setEmailVerified(true);
    } catch (error) {
      console.log(error);
      setEmailVerified(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <Container
      maxWidth="xl"
      style={{ height: "calc(100vh - 68px)", paddingTop: "20px" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'column',
            gap: 2
          }}
        >
          {isEmailVerified ? (
            <Typography sx={{fontWeight: 'bold'}}>
              Thank you, your e-mail is now confirmed. You may close this page.
            </Typography>
          ) : (
            <Typography sx={{fontWeight: 'bold'}}>Something went wrong, please try again</Typography>
          )}
          <Button variant="outlined" onClick={() => history.push("/")}>
            Back To Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
