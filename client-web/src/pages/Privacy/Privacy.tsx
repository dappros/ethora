import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { Blocking } from "./Blocking";
import { DocumentsShare } from "./DocumentsShareTab";
import { ManageData } from "./ManageData";
import { ProfileShareTab } from "./ProfileShareTab";
import { Visibility } from "./VisibilityTab";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const containerStyle = { display: "flex", justifyContent: "center" };

const Privacy = () => {
  const [tab, setTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={tab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Visibility" {...a11yProps(0)} />
        <Tab label="Profile Shares" {...a11yProps(1)} />
        <Tab label="Document Shares" {...a11yProps(2)} />
        <Tab label="Blocking" {...a11yProps(3)} />
        <Tab label="Manage Data" {...a11yProps(4)} />
      </Tabs>
      {tab === 0 && (
        <Box sx={containerStyle}>
          <Visibility handleChangeTab={handleChangeTab} />
        </Box>
      )}
      {tab === 1 && (
        <Box sx={containerStyle}>
          <ProfileShareTab />
        </Box>
      )}
      {tab === 2 && (
        <Box sx={containerStyle}>
          <DocumentsShare />
        </Box>
      )}
      {tab === 3 && (
        <Box sx={containerStyle}>
          <Blocking />
        </Box>
      )}
      {tab === 4 && (
        <Box sx={containerStyle}>
          <ManageData />
        </Box>
      )}
    </Box>
  );
};

export default Privacy;
