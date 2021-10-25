/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

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
