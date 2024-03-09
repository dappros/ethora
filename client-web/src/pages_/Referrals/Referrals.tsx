import React, { useState } from "react"
import { Typography, Box, Button, TextField } from "@mui/material"
import { useStoreState } from "../../store"
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt"
import ShareIcon from "@mui/icons-material/Share"
import { useSnackbar } from "../../context/SnackbarContext"
import { useFormik } from "formik"
import { getBalance, httpWithAuth } from "../../http"

const coinImg = "/coin.png"

export interface IReferrals {}

interface IValues {
  refLink: string
}

const validate = (values: IValues) => {
  const errors: IValues = { refLink: "" }
  if (!values.refLink) {
    errors.refLink = "Link is required"
  }

  return errors
}

const Referrals: React.FC<IReferrals> = ({}) => {
  const link = useStoreState((state) => state.user._id)
  const walletAddress = useStoreState((state) => state.user.walletAddress)

  const setBalance = useStoreState((state) => state.setBalance)

  const referrerId = useStoreState((state) => state.user.referrerId)
  const { showSnackbar } = useSnackbar()
  const formik = useFormik({
    initialValues: { refLink: "" },
    validate,
    onSubmit: async ({ refLink }, { setSubmitting }) => {
      if (referrerId) {
        showSnackbar("error", "You already added your referral")
        return
      }
      if (refLink === link) {
        showSnackbar("error", "You cannot be your referral")
        return
      }
      setSubmitting(true)
      try {
        const res = await httpWithAuth().post("/users/referral", {
          referrerId: refLink,
        })
        const balance = await getBalance(walletAddress)
        setBalance(balance.data.balance)
        showSnackbar("success", "Referral successfully added")
      } catch {
        showSnackbar("error", "Something went wrong")
      }
      setSubmitting(false)
    },
  })

  const onShareClick = () => {
    navigator.clipboard.writeText(link)

    showSnackbar("success", "Link copied")
  }
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
        <Typography
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          Gift friends 25
          <img alt="" style={{ width: "16px", height: "16px" }} src={coinImg} />
          and receive 25
          <img alt="" style={{ width: "16px", height: "16px" }} src={coinImg} />
          . Send friends invite with your personal invitation code
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
            id="shareCode"
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
            error={!!formik.touched.refLink && !!formik.errors.refLink}
          />
          <Button
            disabled={formik.isSubmitting}
            variant={"contained"}
            id="submitEarn"
            type={"submit"}
          >
            Earn coins
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default Referrals
