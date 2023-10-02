import React, { useMemo, useState } from "react";
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
import { useHistory, useLocation } from "react-router";
import { loginEmail, TLoginSuccessResponse } from "../../http";
import { useStoreState } from "../../store";
import { useSnackbar } from "../../context/SnackbarContext";

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
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
  updateUser: (data: TLoginSuccessResponse) => void;
};

export function EmailSingInForm(props: TProps) {
  const history = useHistory();
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const email = searchParams.get("email");

  const [disable, setDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      email: email || "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      setDisable(true);
      loginEmail(values.email, values.password)
        .then((resp) => {
          if (resp.status === 204) {
            history.push({
              pathname: "/tempPassword",
              search: `?email=${values.email}&tempPassword=${values.password}`,
            });
            return;
          }
          const user = resp.data.user;
          props.updateUser(resp.data);
          props.closeModal();
        })
        .catch((error) => {
          console.log(error);
          showSnackbar("error", "Cannot sign in");
        })
        .finally(() => setDisable(false));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
    >
      <TextField
        error={formik.touched.email && formik.errors.email ? true : false}
        helperText={
          formik.touched.email && formik.errors.email ? formik.errors.email : ""
        }
        margin="dense"
        label="Email"
        name="email"
        id="email"
        type="email"
        fullWidth
        variant="standard"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
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
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                id="showPassword"
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
      <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
        <Button
          disabled={disable}
          type="submit"
          variant="contained"
          id="submitEmail"
        >
          Continue
        </Button>
      </Box>
    </form>
  );
}
