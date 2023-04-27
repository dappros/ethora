import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { registerByEmail } from "../../http";
import { useHistory, useLocation } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { LoadingButton } from "@mui/lab";

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
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
  const [errorMsg, setErrorMsg] = useState("");
  const history = useHistory();
  const { showSnackbar } = useSnackbar();
  const { search } = useLocation();
  const signUpPlan = new URLSearchParams(search).get("signUpPlan");

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      try {
        const resp = await registerByEmail(
          values.email,
          values.firstName,
          values.lastName,
          signUpPlan
        );
        resetForm();
        showSnackbar(
          "success",
          "Check your e-mail to finish signing up for Ethora"
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
      setSubmitting(false);
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
        <LoadingButton
          type="submit"
          variant="contained"
          loading={formik.isSubmitting}
        >
          Continue
        </LoadingButton>
      </Box>
    </form>
  );
}
