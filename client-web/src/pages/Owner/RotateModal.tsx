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
import * as http from '../../http'
import { useStoreState } from '../../store'

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  app?: {
    appName: string
    _id: string
  } | null;
};

export default function RotateModal(props: TProps) {
  const [loading, setLoading] = React.useState(false)
  const updateApp = useStoreState(state => state.updateApp)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const onRotate = () => {
    if (props.app && props.app?._id) {
      setLoading(true)
      http.rotateAppJwt(props.app._id)
        .then((response) => {
          updateApp(response.data.app)
          props.setOpen(false)
        })
        .finally(() => setLoading(false))
    }
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={() => {}}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure want to rotate JWT for application {props.app?.appName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will need to update your app clients(mobile, web) with new App Jwt
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} variant="contained" autoFocus onClick={() => props.setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton variant="contained" loading={loading} color="error" onClick={onRotate} autoFocus>
            Rotate
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
