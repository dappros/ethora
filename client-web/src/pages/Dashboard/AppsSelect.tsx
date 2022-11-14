import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type Props = {
  apps: any[];
  setCurrentAppIndex: React.Dispatch<React.SetStateAction<number>>;
  currentAppIndex: number;
};

export default function AppsSelect(props: Props) {
  const handleChange = (event) => {
    props.setCurrentAppIndex(event.target.value);
  };

  return (
    <Box sx={{ width: 150, marginBottom: "20px" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">App</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.currentAppIndex}
          label="App"
          onChange={handleChange}
        >
          {props.apps.map((app, index) => {
            return (
              <MenuItem value={index} key={app._id}>
                {app.appName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
