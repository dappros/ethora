import {TouchableOpacity, Text, View} from 'react-native';
import React from 'react';

export const CommonButton = (props) => {
    return(
        <TouchableOpacity onPress={()=>props.onPress()} style={props.style}>
            <View style={{flexDirection: props.icon?"row":"column", alignItems:"center"}}>
            {props.icon?
                props.iconType:null

            }
           <Text style={props.textStyle}> {props.buttonText} </Text>
           </View>
        </TouchableOpacity>
    )
}