import React, { useState } from "react"
import { useParams } from "react-router"
import { useStoreState } from "../../store"
import Box from "@mui/material/Box"
import { Container, Tab, Tabs, Typography } from "@mui/material"
import { Appearance } from "./Appearance"
import { UserDefaults } from "./UserDefaults"
import { Services } from "./Services"
import { Backend } from "./Backend"

const tabs = ["Appearance", "User defaults", "Services", "Backend"]

interface TabPanelProperties {
  children?: React.ReactNode
  index: number
  value: number
}
function a11yProperties(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}
function TabPanel(properties: TabPanelProperties) {
  const { children, value, index, ...other } = properties

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
export const AppEdit = () => {
  const [activeStep, setActiveStep] = useState(0)
  const { appId } = useParams<{ appId: string }>()
  const app = useStoreState((s) => s.apps.find((app) => app._id === appId))

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveStep(newValue)
  }

  return (
    <Container
      maxWidth={"xl"}
      sx={{ marginTop: 2, minHeight: "70vh", paddingBottom: 5 }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeStep}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabs.map((tab, index) => {
            return <Tab label={tab} {...a11yProperties(index)} />
          })}
        </Tabs>
      </Box>
      <Box sx={{ mt: 2 }}>
        <TabPanel value={activeStep} index={0}>
          <Appearance />
        </TabPanel>
        <TabPanel value={activeStep} index={1}>
          <UserDefaults />
        </TabPanel>
        <TabPanel value={activeStep} index={2}>
          <Services />
        </TabPanel>
        <TabPanel value={activeStep} index={3}>
          <Backend />
        </TabPanel>
      </Box>
    </Container>
  )
}
