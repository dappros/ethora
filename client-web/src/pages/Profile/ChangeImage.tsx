import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useStoreState } from "../../store";
import LoadingButton from "@mui/lab/LoadingButton";
import * as http from "../../http";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import defUserImage from "../../assets/images/def-ava.png";
import "react-image-crop/dist/ReactCrop.css";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ChangeImage({ open, setOpen }: TProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onSave() {}

  return (
    <Dialog onClose={() => {}} open={open}>
      <Box>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Change Image
          <IconButton
            onClick={() => {
              setImgSrc("");
              setOpen(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ typography: "body1", padding: 1 }}>
          <Box style={{ width: "400px" }}>
            {!imgSrc && (
              <Box
                style={{
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  ref={fileRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={onSelectFile}
                />
                <Button onClick={() => fileRef.current.click()}>Upload</Button>
              </Box>
            )}
            {!!imgSrc && (
              <Box>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => {
                    console.log("onComplete ");
                    setCompletedCrop(c);
                  }}
                  minWidth={100}
                  minHeight={100}
                >
                  <img
                    style={{ width: "400px", height: "auto" }}
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
                <Box style={{ display: "flex" }}>
                  <Button onClick={onSave} style={{ marginLeft: "auto" }}>
                    Save
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
