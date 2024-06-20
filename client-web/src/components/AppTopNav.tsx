import { AppBar, Box, Toolbar } from "@mui/material";
import { bootstrapChatWithUser } from "../../comp/dist/main"
import { useEffect } from "react";
import { useStoreState } from "../store";
import { walletToUsername } from "../utils/walletManipulation"

export default function AppTopNav() {
    const user = useStoreState((state) => state.user)

    useEffect(() => {
        bootstrapChatWithUser({
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              walletAddress: user.walletAddress,
              xmppPassword: user.xmppPassword,
              xmppUsername: walletToUsername(user.walletAddress),
            },
            service: "wss://xmpp.ethoradev.com:5443/ws",
            canCreateRooms: true,
            canLeaveRooms: true,
            canPostFiles: false,
            langOptions: {
              languages: [
                { iso639_1: 'es', name: 'Spanish' },
                { iso639_1: 'en', name: 'English' },
                { iso639_1: 'pt', name: 'Portuguese' },
                { iso639_1: 'ht', name: 'Haitian' },
                { iso639_1: 'zh', name: 'Chinese' }
              ],
            }
          })

    }, [])
    return (
        <AppBar position="static">
            <Box sx={{ width: "100%", padding: "0 20px" }}>
                <Toolbar disableGutters></Toolbar>
            </Box>
        </AppBar>
    )
}