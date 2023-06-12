import React from "react";
import { Button, Dialog, DialogTitle, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import QRCode from "react-qr-code";
import { truncateString } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";

export interface IQrModal {
  open: boolean;
  link: string;
  onClose: () => void;
  title?: string;
}

export const QrModal: React.FC<IQrModal> = ({ title, open, link, onClose }) => {
  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      {!!title && (
        <DialogTitle sx={{ padding: "0 24px", paddingTop: "20px" }}>
          {title}
        </DialogTitle>
      )}
      <Box sx={{ padding: "20px" }}>
        <QRCode
          size={256}
          style={{ height: "50vh", maxWidth: "100%", width: "100%" }}
          value={link}
          viewBox={`0 0 256 256`}
        />
        <Box
          sx={{
            boxShadow: "0px 0px 10px -5px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pl: "10px",
            my: "10px",
          }}
        >
          <span>{truncateString(link, 50)}</span>
          <Button
            variant="contained"
            sx={{ borderRadius: "10px", marginLeft: '5px' }}
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy
          </Button>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "black",
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: "30px",
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Dialog>
  );
};
