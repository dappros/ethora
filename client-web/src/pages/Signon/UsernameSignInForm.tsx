import * as React from "react";
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
import { loginUsername } from "../../http";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../store";

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

  return errors;
};

type TProps = {
  closeModal: () => void;
};

export function UsernameSignInForm(props: TProps) {
  const setUser = useStoreState((state) => state.setUser);
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setDisableSubmit(true);
      loginUsername(values.username, values.password)
        .then((result) => {
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
          });
          props.closeModal();
          history.push(
            `/profile/${result.data.user.defaultWallet.walletAddress}`
          );
        })
        .catch((error) => {
          console.log(error);
          setHttpError("http Error");
          if (error.response) {
            if (
              error.response.status === 404 ||
              error.response.status === 401
            ) {
              setHttpError("Wrong credentials");
            }
          }
        })
        .finally(() => {
          setDisableSubmit(false);
        });
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [disableSubmit, setDisableSubmit] = React.useState(false);
  const [httpError, setHttpError] = React.useState("");

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        inputProps={{
          autoComplete: "off",
        }}
        error={formik.touched.username && formik.errors.username ? true : false}
        helperText={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : ""
        }
        margin="dense"
        label="Username"
        name="username"
        fullWidth
        variant="standard"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.username}
      />
      <FormControl
        error={formik.touched.password && formik.errors.password ? true : false}
        fullWidth
        variant="standard"
      >
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
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
      {!!httpError && (
        <Typography sx={{ color: "error.main" }} component="p">
          {httpError}
        </Typography>
      )}
      <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
        <Button disabled={disableSubmit} type="submit" variant="contained">
          Continue
        </Button>
      </Box>
    </form>
  );
}
