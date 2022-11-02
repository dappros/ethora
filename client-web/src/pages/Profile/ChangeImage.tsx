import React, { useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from "react-image-crop";
import * as http from "../../http";
import { useStoreState } from "../../store";
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
  const user = useStoreState((state) => state.user);
  const setUser = useStoreState((state) => state.setUser);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [blob, setBlob] = useState<Blob>();
  const aspect = 2;

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

  function onSave() {
    const form = new FormData();
    form.append("file", blob, "profileImg");
    http
      .updateProfile(form)
      .then((response) => {
        // response.data.user
        setUser(response.data.user);
        setOpen(false);
      })
      .catch((e) => console.log(e));
  }

  function onCropComplete(crop) {
    const canvas = document.createElement("canvas");
    const pixelRatio = window.devicePixelRatio;
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }

        setBlob(blob);
      },
      "image/jpeg",
      1
    );
  }

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
                  onComplete={onCropComplete}
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
