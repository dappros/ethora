import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  app?: {
    appName: string
    _id: string
  } | null;
};

export default function DeletAppModal(props: TProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => {}}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure want to remove application {props.app?.appName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your app clients(mobile, web) will not be able to send requests to Platform API after deleting the app
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={false} variant="contained" autoFocus onClick={() => props.setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton variant="contained" loading={false} color="error" onClick={() => {}} autoFocus>
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
