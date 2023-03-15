import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { useFormik } from "formik";
import { useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import { registerUsername, loginUsername } from "../../http";

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  if (!values.username) {
    errors.username = "Required";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length <= 3) {
    errors.password = "Must be 3 characters or more";
  }

  if (!values.firstName) {
    errors.firstName = "Required";
  }

  if (!values.lastName) {
    errors.lastName = "Required";
  }

  return errors;
};

type TProps = {
  closeModal: () => void;
};

export function UsernameSignUpForm(props: TProps) {
  const history = useHistory();
  const setUser = useStoreState((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: (fd) => {
      setDisableSubmit(true);
      registerUsername(fd.username, fd.password, fd.firstName, fd.lastName)
        .then((resp) => {
          loginUsername(fd.username, fd.password).then((result) => {
            setUser({
              firstName: result.data.user.firstName,
              lastName: result.data.user.lastName,
              description: result.data.user.description,
              xmppPassword: result.data.user.xmppPassword,
              _id: result.data.user._id,
              walletAddress: result.data.user.defaultWallet.walletAddress,
              token: result.data.token,
              refreshToken: result.data.refreshToken,
              profileImage: result.data.user.profileImage,
              isProfileOpen: result.data.user.isProfileOpen,
              isAssetsOpen: result.data.user.isAssetsOpen,
              ACL: result.data.user.ACL,
              isAllowedNewAppCreate: result.data.isAllowedNewAppCreate,
              isAgreeWithTerms: result.data.user.isAgreeWithTerms,
              stripeCustomerId: result.data.user.stripeCustomerId
            });
            props.closeModal();
            history.push(
              `/profile/${result.data.user.defaultWallet.walletAddress}`
            );
          });
        })
        .catch((error) => {})
        .finally(() => {
          setDisableSubmit(false);
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : ""
        }
        margin="dense"
        label="Username"
        name="username"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        fullWidth
        variant="standard"
        inputProps={{
          autoComplete: "off",
        }}
      />
      <FormControl
        error={formik.touched.password && Boolean(formik.errors.password)}
        fullWidth
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? "text" : "password"}
          fullWidth
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((show) => !show)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {formik.touched.password && formik.errors.password && (
          <FormHelperText>{formik.errors.password}</FormHelperText>
        )}
      </FormControl>
      <TextField
        margin="dense"
        inputProps={{
          autoComplete: "off",
        }}
        label="First Name"
        name="firstName"
        type="text"
        fullWidth
        variant="standard"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={
          formik.touched.firstName && formik.errors.firstName
            ? formik.errors.firstName
            : ""
        }
      />
      <TextField
        margin="dense"
        label="Last Name"
        name="lastName"
        type="text"
        fullWidth
        inputProps={{
          autoComplete: "off",
        }}
        variant="standard"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={
          formik.touched.lastName && formik.errors.lastName
            ? formik.errors.lastName
            : ""
        }
      />
      <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
        <Button disabled={disableSubmit} type="submit" variant="contained">
          Continue
        </Button>
      </Box>
    </form>
  );
}
