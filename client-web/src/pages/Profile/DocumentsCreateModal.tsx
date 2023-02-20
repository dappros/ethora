import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as http from "../../http";
import FormHelperText from "@mui/material/FormHelperText";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDocuments: (Document: Object) => void;
};

export default function DocumentsCreateModal(props: TProps) {
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      documentName: "",
      file: null,
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.documentName) {
        errors.documentName = "Required";
      }

      if (!values.file) {
        errors.file = "Required";
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        console.log(values);
        const fd = new FormData();
        fd.append("files", values.file);
        const fileUploadResp = await http.httpWithAuth().post("/files", fd);
        const fileLocation = fileUploadResp.data.results[0].location;
        const documentUploadRest = await http.httpWithAuth().post("/docs", {
          documentName: values.documentName,
          files: [fileLocation],
        });
        props.setDocuments(documentUploadRest.data);
        setLoading(false);
        props.setOpen(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    },
  });

  return (
    <Dialog onClose={() => props.setOpen(false)} maxWidth={false} open={props.open}>
      <Box style={{ width: "400px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Create New Document
          <IconButton onClick={() => props.setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box
          sx={{
            width: "100%",
            typography: "body1",
            padding: 1,
          }}
        >
          <form style={{ flex: "1" }} onSubmit={formik.handleSubmit}>
            <input
              onChange={(e) => {
                formik.setFieldValue("file", e.target.files[0]);
              }}
              type="file"
            />
            {formik.touched.file && formik.errors.file ? (
              <FormHelperText error>
                {formik.errors.file as string}
              </FormHelperText>
            ) : null}
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="Document Name"
              name="documentName"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.documentName &&
                Boolean(formik.errors.documentName)
              }
              helperText={
                formik.touched.documentName && formik.errors.documentName
                  ? formik.errors.documentName
                  : ""
              }
            />
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
              >
                Create
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  );
}
