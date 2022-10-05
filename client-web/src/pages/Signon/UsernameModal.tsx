import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UsernameSignInForm from "./UsernameSignInForm";
import UsernameSignUpForm from "./UsernameSignUpForm";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UsernameModal({ open, setOpen }: TProps) {
  const [tab, setTab] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const onClose = (e: any, reason: any) => {
    if (reason === 'backdropClick') {
      return;
    }
  }

  return (
    <Dialog onClose={onClose} maxWidth={false} open={open}>
      <Box style={{ width: "350px" }}>
        <DialogTitle style={{display: 'flex', justifyContent: 'space-between'}}>
          Continue with Username
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
              <UsernameSignInForm closeModal={() => setOpen(false)} />
            </TabPanel>
            {/* SIGN UP */}
            <TabPanel value="2">
              <UsernameSignUpForm closeModal={() => setOpen(false)} />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Dialog>
  );
}
