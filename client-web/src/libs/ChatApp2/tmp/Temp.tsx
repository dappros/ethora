import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { actionConnect } from "../actions";

interface Props {
    xmppUsername: string;
    xmppPassword: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    walletAddress?: string;
}

export function Temp({ xmppUsername, xmppPassword, firstName, lastName, profileImage, walletAddress }: Props) {
    const doBootstraped = useChatStore(state => state.doBootstraped)
    useEffect(() => {
        doBootstraped({
            xmppUsername,
            xmppPassword,
            firstName,
            lastName,
            profileImage,
            walletAddress,
        })
        actionConnect().then(() => console.log("then websocketConnect"))
    }, [])

    return (
        <div>
            <div>
                <span>xmppUsername </span>
                <span>{xmppUsername}</span>
            </div>
            <div>
                <span>xmppPassword </span>
                <span>{xmppPassword}</span>
            </div>
        </div>
    )
}
