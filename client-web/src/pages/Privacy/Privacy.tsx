import { Box, Tab, Tabs} from '@mui/material';
import * as React from 'react';
import {CustomToast} from '../../componets/CustomToast';
import { changeUserData } from '../../http';
import { useStoreState } from '../../store';
import { Blocking } from './Blocking';
import { DocumentsShare } from './DocumentsShareTab';
import { ManageData } from './ManageData';
import { ProfileShareTab } from './ProfileShareTab';
import { Visibility } from './VisibilityTab';

const state: Record<string, string> = {
    open: 'true',
    restricted: 'false',
    full: 'true',
    individual: 'false',
};

function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Privacy = () => {
    const updateUserProfilePermission = useStoreState((state) => state.updateUserProfilePermission);
    const updateUserDocumentsPermission = useStoreState((state) => state.updateUserDocumentsPermission);
    const user = useStoreState((state) => state.user);
    const [tab, setTab] = React.useState(0);
    const [profileVisibility, setProfileVisibility] = React.useState(user.isProfileOpen?true:false);
    const [documentsPermissionType, setDocumentsPermissionType] = React.useState(user.isAssetsOpen?true:false);
    const [showSnack, setShowSnack] = React.useState(false)
    const [loading, setLoading] = React.useState<'assets' | 'profile' | null>(null);
    
    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const updateProfileVisibility = async (value: 'open'|'restricted') => {
        const profileState = state[value];
        setLoading('profile');
    
        try {
            const formData = new FormData();
            formData.append('isProfileOpen', profileState);
            const {data} = await changeUserData(formData);
        
            setShowSnack(true);
            updateUserProfilePermission(value==='open'?true:false);
            setProfileVisibility(value==='open'?true:false);
        } catch (error) {
          console.log(error);
        }
        setLoading(null);
    };

    const updateAssetsVisibility = async (value: 'full'|'individual') => {
        setLoading('assets');
        const assetsState = state[value];
        try {
            const formData = new FormData();
            formData.append('isAssetsOpen', assetsState);
            const {data} = await changeUserData(formData);

            setShowSnack(true);
            updateUserDocumentsPermission(value==='full'?true:false);
            setDocumentsPermissionType(value==='full'?true:false);
        } catch (error) {
          console.log(error);
        }
    
        setLoading(null);
      };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="Visibility" {...a11yProps(0)} />
                <Tab label="Profile Shares" {...a11yProps(1)} />
                <Tab label="Document Shares" {...a11yProps(2)} />
                <Tab label="Blocking" {...a11yProps(3)} />
                <Tab label="Manage Data" {...a11yProps(4)} />
            </Tabs>
            {tab===0?
            <Visibility
            handleChangeTab={handleChangeTab}
            isDisabledProfileButton={loading==='profile'?true:false}
            isDisabledDocumentsButton={loading==='assets'?true:false}
            defaultProfileVisibility={profileVisibility?'open':'restricted'}
            updateProfileVisibility={updateProfileVisibility}
            updateAssetsVisibility={updateAssetsVisibility}
            defaultAssetVisibility={documentsPermissionType?'full':'individual'}/>:null
            }
            {tab===1?
            <ProfileShareTab

            />:null
            }
            {
                tab===2?
                <DocumentsShare/>:null
            }
            {
                tab===3?
                <Blocking/>:null
            }
            {
                tab===4?
                <ManageData/>:null
            }
            <CustomToast
            type='success'
            open={showSnack}
            message='Profile permissions updated'
            handleClose={()=>setShowSnack(false)}
            />
        </Box>
    );
};

export default Privacy;