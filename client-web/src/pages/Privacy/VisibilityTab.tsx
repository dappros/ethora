import { Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import * as React from 'react';

interface VisibilityProps {
    defaultProfileVisibility:'open' | 'restricted';
    updateProfileVisibility:(value:string) => Promise<void>;
    isDisabledProfileButton:boolean;
    handleChangeTab:(event:React.SyntheticEvent, newValue:number) => void;
    isDisabledDocumentsButton:boolean;
    defaultAssetVisibility: 'full' | 'individual';
    updateAssetsVisibility:(value:string) => Promise<void>;
}

export const Visibility = (props: VisibilityProps) => {


    const {
        defaultProfileVisibility,
        updateProfileVisibility,
        isDisabledProfileButton,
        handleChangeTab,
        isDisabledDocumentsButton,
        defaultAssetVisibility,
        updateAssetsVisibility
    } = props

    return (
        <Container style={{margin:20, flexDirection:"column", display:"flex"}}>


            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Profile Visiblility</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={defaultProfileVisibility}
                    name="radio-buttons-group"
                    onChange={(event, value)=> value==='open'?updateProfileVisibility(value):updateProfileVisibility(value)}
                >
                    <FormControlLabel value="open" control={<Radio />} label={<Typography fontWeight={"bold"}>Open (default)</Typography>} />
                    <Typography fontSize={'15px'}>
                    Your profile can be viewed by anyone who follows your
                    profile link or QR code
                    </Typography>
                    <FormControlLabel value="restricted" control={<Radio />} label={<Typography fontWeight={"bold"}>Restricted</Typography>} />
                    <Typography fontSize={'15px'}>
                    Only users with your permission or temporary secure link can
                    see your profile
                    </Typography>
                </RadioGroup>
            </FormControl>

            <Button
            style={{
                marginTop:'10px',
                marginBottom: '20px',
                width:'800px'
            }}
            disabled={isDisabledProfileButton} 
            onClick={(event)=>handleChangeTab(event, 1)}
            variant="contained">
                Manage profile shares
            </Button>

            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Documents Visiblility</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={defaultAssetVisibility}
                    name="radio-buttons-group"
                    onChange={(event, value)=> updateAssetsVisibility(value)}
                >
                    <FormControlLabel value="full" control={<Radio />} label={<Typography fontWeight={"bold"}>Full (default)</Typography>} />
                    <Typography fontSize={'15px'}>
                    Show all Documents to those who can see your profile
                    </Typography>
                    <FormControlLabel value="individual" control={<Radio />} label={<Typography fontWeight={"bold"}>Individual</Typography>} />
                    <Typography fontSize={'15px'}>
                    You need to share each document individually before others
                    can see them
                    </Typography>
                </RadioGroup>
            </FormControl>

            <Button 
            style={{
                marginTop:'10px',
                marginBottom: '20px',
                width:'800px'
            }}
            disabled={isDisabledDocumentsButton} 
            fullWidth={false}
            onClick={(event)=>handleChangeTab(event, 2)}
            variant="contained">
                Manage documents shares
            </Button>
        </Container>
    );
};
