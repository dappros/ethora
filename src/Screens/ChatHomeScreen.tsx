import React,{useState} from 'react';
import { Spinner, Text, View } from 'native-base';

interface ChatHomeScreenProps {}

const ChatHomeScreen = (props: ChatHomeScreenProps) => {

    const [loading, setLoading] = useState(false);

    const setBodyContent = () => {
        if(loading){
            <View>
                <Spinner />
            </View>
        }
        
    }

    return (
        <View>
            <Text>ChatHomeScreen</Text>
        </View>
    );
};

export default ChatHomeScreen;