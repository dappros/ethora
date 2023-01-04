import React from "react";
import { Button, Dialog } from "@mui/material";
import { Box } from "@mui/system";
import QRCode from "react-qr-code";
import { truncateString } from "../../utils";

export interface IQrModal {
  open: boolean;
  link: string;
  onClose: () => void;
}

export const QrModal: React.FC<IQrModal> = ({ open, link, onClose }) => {
  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      <Box sx={{ padding: "20px" }}>
        <QRCode
          size={256}
          style={{ height: '60vh', maxWidth: "100%", width: "100%" }}
          value={link}
          viewBox={`0 0 256 256`}
        />
        <Box
          sx={{
            boxShadow: "2px 0px 5px 0px rgba(0,0,0,0.75)",
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
            sx={{ borderRadius: "10px" }}
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
