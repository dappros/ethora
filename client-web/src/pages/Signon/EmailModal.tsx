import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useQuery } from "../../utils";
import { EmailSingInForm } from "./EmailSignInForm";
import { EmailSignUpForm } from "./EmailSignUpForm";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function EmailModal({ open, setOpen }: TProps) {
  const [tab, setTab] = useState("1");
  const [message, setMessage] = useState("");
  const query = useQuery();

  const onClose = (e: any, reason: any) => {
    setOpen(false);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Dialog maxWidth={false} open={open} onClose={onClose}>
      <Box style={{ width: "350px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Continue with Email
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Sign In" value="1" />
                <Tab label="Sign Up" value="2" />
              </TabList>
            </Box>
            {/* SIGN IN */}
            <TabPanel value="1">
              <Box>{message}</Box>
              <EmailSingInForm closeModal={() => setOpen(false)} />
            </TabPanel>
            {/* SIGN UP */}
            <TabPanel value="2">
              <EmailSignUpForm closeModal={() => setOpen(false)} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Dialog>
  );
}
