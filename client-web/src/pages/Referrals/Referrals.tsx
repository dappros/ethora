import React, { useState } from "react";
import { Typography, Box, Button, TextField } from "@mui/material";
import { useStoreState } from "../../store";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ShareIcon from "@mui/icons-material/Share";
import { useSnackbar } from "../../context/SnackbarContext";
import { useFormik } from "formik";
import { getBalance, httpWithAuth } from "../../http";

export interface IReferrals {}

export const Referrals: React.FC<IReferrals> = ({}) => {
  const link = useStoreState((state) => state.user._id);
  const walletAddress = useStoreState((state) => state.user.walletAddress);

  const setBalance = useStoreState((state) => state.setBalance);

  const referrerId = useStoreState((state) => state.user.referrerId);
  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: { refLink: "" },
    onSubmit: async ({ refLink }, { setSubmitting }) => {
      if (referrerId) {
        showSnackbar("error", "You already added your referral");
        return;
      }
      if (refLink === link) {
        showSnackbar("error", "You cannot be your referral");
        return;
      }
      setSubmitting(true);
      try {
        const res = await httpWithAuth().post("/users/referral", {
          referrerId: refLink,
        });
        const balance = await getBalance(walletAddress);
        setBalance(balance.data.balance);
        showSnackbar("success", "Referral successfully added");
      } catch (error) {
        showSnackbar("error", "Something went wrong");
      }
      setSubmitting(false);
    },
  });

  const onShareClick = () => {
    navigator.clipboard.writeText(link);

    showSnackbar("success", "Link copied");
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Box>
        <Box
          sx={{
            fontSize: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PersonAddAltIcon color="primary" fontSize="inherit" />
        </Box>
        <Typography>
          Gift friends 25 ETO and receive 25 ETO. Send friends invite with your
          personal invitation code
        </Typography>
        <Typography
          sx={{ fontWeight: "bold", textAlign: "center", fontSize: "18px" }}
        >
          Your invitation code
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={onShareClick}
            variant={"contained"}
            startIcon={<ShareIcon />}
          >
            {link}
          </Button>
        </Box>
        <Typography
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "18px",
            margin: "10px 0",
          }}
        >
          Or enter your referral code to earn coins.
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            margin="dense"
            label="Your referral code"
            name="refLink"
            type="text"
            fullWidth
            inputProps={{
              autoComplete: "off",
            }}
            variant={"outlined"}
            onChange={formik.handleChange}
            value={formik.values.refLink}
          />
          <Button
            disabled={formik.isSubmitting}
            variant={"contained"}
            type={"submit"}
          >
            Earn coins
          </Button>
        </form>
      </Box>
    </Box>
  );
};
