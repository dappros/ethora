import { Box, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { TUserBlackList, useStoreState } from '../../store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import xmpp from '../../xmpp';
import moment from 'moment';
interface BlockingProps {}

interface BlackListUserItemProps {
    userItem: TUserBlackList
    handleRemove: (userId:string) => void
}

export const Blocking = (props: BlockingProps) => {

    const blacklist = useStoreState((store) => store.blackList)

    const handleRemoveUserFromBlackList = (userId:string) => {
        console.log(userId)
        xmpp.removeUserFromBlackList(
            userId
        )
        xmpp.getBlackList();
    }

    return (
        <Box style={{
            margin: '20px',
        }}>
            <Box>
            <Typography fontWeight={"bold"}>
            Users you have blocked
            </Typography>
            <Typography>
            The blocked users cannot message you or view your profile. Tap the bin
            icon if you wish to remove the block.
            </Typography>

            {
                blacklist.map(item => {
                    return(
                        <BlackListUserItem
                        handleRemove={handleRemoveUserFromBlackList}
                        userItem={item}
                        />
                    )
                })
            }
            </Box>
        </Box>
    );
};

function BlackListUserItem(props:BlackListUserItemProps){

    const {
        userItem,
        handleRemove
    } = props

    return(
        <Box
        style={{
            marginTop:'20px',
            display:'flex',
            alignItems:"center",
            justifyContent:"space-between",
            maxWidth:"300px"
        }}
        >
            <Box
            style={{
                alignItems:"center",
                display:'flex',
                justifyContent:"space-around"
            }}
            >
                <AccountCircleIcon
                fontSize='large'
                />
            
                <Box
                style={{
                    marginLeft:'10px'
                }}
                >
                <Typography>{userItem.fullName}</Typography>
                <Typography>{moment(userItem.date).format('DD MMMM YYYY')}</Typography>
                </Box>
            </Box>
            <IconButton onClick={()=>handleRemove(userItem.user)}>
                <RemoveCircleIcon color='error'/>
            </IconButton>
        </Box>
    )

}
