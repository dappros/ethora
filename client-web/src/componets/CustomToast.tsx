import { Snackbar } from '@mui/material';
import * as React from 'react';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

interface CustomToastProps{
    open:boolean;
    handleClose:() => void;
    type:AlertColor;
    message:string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export const CustomToast = (props:CustomToastProps) => {

    const {open, handleClose, type, message} = props

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>

    );
};
