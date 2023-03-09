import React, { useState, forwardRef } from "react";
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
import { registerByEmail } from "../../http";
import { useHistory, useLocation } from "react-router-dom";
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

export function EmailSignUpForm(props: TProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const history = useHistory();
  const { showSnackbar } = useSnackbar();
  const { search } = useLocation();
  const signUpPlan = new URLSearchParams(search).get("signUpPlan");
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      try {
        const resp = await registerByEmail(
          values.email,
          values.firstName,
          values.lastName,
          values.password,
          signUpPlan
        );
        resetForm();
        showSnackbar(
          "success",
          "Verify your e-mail to finish signing up for Ethora"
        );
      } catch (error) {
        if (error.response && error.response.status === 400) {
          if (error.response.data.errors) {
            let errors: string[] = [];

            for (const e of error.response.data.errors) {
              if (e.msg) {
                errors.push(e.msg);
              }
            }
            setErrorMsg(errors.join(", "));
            showSnackbar("error", errors.join(", "));
          }
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={
          formik.touched.email && formik.errors.email ? formik.errors.email : ""
        }
        margin="dense"
        label="Email"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        fullWidth
        variant="standard"
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
        label="First Name"
        name="firstName"
        type="text"
        fullWidth
        variant="standard"
        value={formik.values.firstName}
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
        variant="standard"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={
          formik.touched.lastName && formik.errors.lastName
            ? formik.errors.lastName
            : ""
        }
      />
      {!!errorMsg && <Box sx={{ color: "red" }}>{errorMsg}</Box>}
      <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
        <Button type="submit" variant="contained">
          Continue
        </Button>
      </Box>
    </form>
  );
}
