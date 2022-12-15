import { Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { CustomToast } from '../../componets/CustomToast';
import { deleteSharedLink, getSharedLinksService } from '../../http';
import { useStoreState } from '../../store';
import { QrModal } from '../Profile/QrModal';
import { AddDocumentTabPanel } from './AddDocumentTabPanel';
import { ManageDocumentShareTabPanel } from './ManageDocumentShareTabPanel';
import { ISharedLink } from './ProfileShareTab';

interface DocumentsShareProps {}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const DocumentsShare = (props: DocumentsShareProps) => {
  const [tab, setTab] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [sharedLinks, setSharedLinks] = React.useState<ISharedLink[]>([]);
  const [docLink, setDocLink] = React.useState('')
  const user = useStoreState((state) => state.user);
   
  const handleOpenToast = () => setShowToast(true);
  const handleCloseToast = () => setShowToast(false);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenModal = (link:string) => {
    setDocLink(link)
    setOpenModal(true)
  };
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const getSharedLinks = async () => {
    setLoading(true);
    try {
      const {data} = await getSharedLinksService();
      setSharedLinks(data.items.filter(item => item.resource === 'document'));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const deleteLink = async (linkToken: string) => {
    try {
      const {data} = await deleteSharedLink(linkToken)
      await getSharedLinks();
      handleOpenToast()
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(()=>{
    getSharedLinks()
  },[])


  return (
    <Box>
      <Tabs style={{display:'flex'}} value={tab} onChange={handleChangeTab} aria-label="basic tabs example">
          <Tab label="Manage" {...a11yProps(0)} />
          <Tab label="Add" {...a11yProps(1)} />
      </Tabs>
    {
      tab === 0?
      (<ManageDocumentShareTabPanel
        handleChangeTab={handleChangeTab}
        sharedLinks={sharedLinks}
        loading={loading}
        handleOpenModal={handleOpenModal}
        deleteLink={deleteLink}
      />):null
    }
    {
      tab === 1?
      (<AddDocumentTabPanel
        getSharedLinks={getSharedLinks}
      />):null
    }
    <QrModal
    open={openModal}
    link={docLink}
    onClose={handleCloseModal}
    />
    <CustomToast
    handleClose={handleCloseToast}
    message={"Link deleted successfully"}
    open={showToast}
    type={"success"}
    />
    </Box>
  );
};
