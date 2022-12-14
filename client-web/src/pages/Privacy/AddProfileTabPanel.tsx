import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { createSharedLink } from '../../http';
import { TUser, useStoreState } from '../../store';
import { ISharedLink } from './ProfileShareTab';
import { QRSection } from './QRSection';

interface AddTabPanelProps {
    getSharedLinks: () => Promise<void>;
}


const HOUR = 60 * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = WEEK * 4;

const expDescription = 'If you set this, this link will only be valid for the given period of time';
const memoDescription = 'Add an optional note so that you remember who you shared this with.';

interface optionsItemProps {
    handleChange: (value:string) => void;
    selectedValue:any;
    title:string;
    description:string;
    type:'menu'|'input'
}


function OptionsItem(props:optionsItemProps){
    const {
    handleChange,
    selectedValue,
    title,
    description,
    type
    } = props

    return(
        <Box
        style={{
            margin:"10px"
        }}
        >
            <Typography
            fontSize={"15px"}
            fontWeight={"bold"}
            >
                {title}
            </Typography>

            <Typography
            fontSize={"15px"}
            >
                {description}
            </Typography>
            {
                type==='menu'?
                <FormControl sx={{ minWidth: 120, marginTop:"20px" }}>
                <InputLabel id="demo-simple-select-helper-label">Expiration</InputLabel>
                <Select
                labelId='demo-simple-select-helper-label'
                id="demo-simple-select-helper"
                value={selectedValue}
                label="Expiration"
                onChange={(e)=> handleChange(e.target.value)}
                >
                    <MenuItem value={(-1).toString()} >
                    No Expiration
                    </MenuItem>
                    <MenuItem value={HOUR.toString()}>
                    1 hour
                    </MenuItem>
                    <MenuItem value={DAY.toString()}>
                    1 day
                    </MenuItem>
                    <MenuItem value={WEEK.toString()}>
                    1 week
                    </MenuItem>
                    <MenuItem value={MONTH.toString()}>
                    1 month
                    </MenuItem>
                </Select>
            </FormControl>:
            <Box style={{marginTop:'20px'}}>
            <TextField
            onChange={(e)=>handleChange(e.target.value)}
            id="outlined-basic" 
            label="shared with Alice"
             variant="outlined" />
            </Box>
            }
        </Box>
    )
}

interface QRSectionProps {
    user:TUser;
    createdLink: ISharedLink
}

export const AddTabPanel = (props: AddTabPanelProps) => {

    const {getSharedLinks} = props
    const [expiration, setExpiration] = React.useState((-1).toString());
    const [memo, setMemo] = React.useState('');
    const [createdLink, setCreatedLink] = React.useState<ISharedLink>({
        _id: '',
        expiration: '',
        memo: '',
        resource: '',
        token: '',
        updatedAt: '',
        userId: '',
        walletAddress: '',
        createdAt:''
      });
    const [loading, setLoading] = React.useState(false);

    const user = useStoreState((state) => state.user);

    const handleSetExpiration = (value:string) => setExpiration(value)
    const handleMemo = (value:string) => setMemo(value)

    const generateLink = async () => {
        const body = {
          expiration: new Date().getTime() + +expiration * 1000,
          memo: memo,
          resource: 'profile',
        };
        setLoading(true);
        try {
          const {data} = await createSharedLink(body)
          console.log(data);
          setCreatedLink(data.sharelinkData);
          getSharedLinks()
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };

    return (
        <Box style={{
            display:"flex",
            alignItems:"flex-start",
            flexDirection:"column",
            margin: '20px',
            }}>
            <Box>
                <Typography
                fontWeight={"bold"}
                >Create a Profile Sharing link</Typography>
                <Typography>
                Send this link to your trusted contact(s) so they can access your
                profile when you're in Restricted mode..
                </Typography>
                <Typography
                fontWeight={"light"}
                fontStyle={'italic'}
                fontSize={"12px"}
                >
                Note: you'll be able to remove this link any time if you change your
                mind.
                </Typography>
            </Box>

            <OptionsItem
            selectedValue={expiration}
            handleChange={handleSetExpiration}
            description={expDescription}
            title={'Expiration'}
            type="menu"
            />
            <OptionsItem
            selectedValue={memo}
            handleChange={handleMemo}
            description={memoDescription}
            title={'Memo'}
            type="input"
            />
            <Box>
                <Typography
                fontSize={"15px"}
                fontWeight={"bold"}
                >Here you go!</Typography>
                <Typography
                fontSize={"15px"}
                >
                Your unique link and QR code have been created. You can share them
                using buttons below.
                </Typography>
                <Typography
                fontWeight={"light"}
                fontStyle={'italic'}
                fontSize={"12px"}
                >
                Note: use "Manage" tab in case you want to copy or modify your sharing
                link in future.
                </Typography>
                <Box
                style={{
                    marginTop:'20px'
                }}
                >
                {
                    createdLink.walletAddress?(
                        <QRSection
                        createdLink={createdLink}
                        user={user}
                        linkType={'profile'}
                        />
                    ):(<Button
                        disabled={loading}
                        onClick={generateLink} 
                        variant="contained">Generate Link</Button>)
                }
                </Box>
            </Box>
        </Box>
    );
};