/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {TextInput,View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/Octicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const CommonTextInput = (props) => {
    return(
        <View style={[{flexDirection: 'row'},props.containerStyle]}>
            <TextInput {...props} placeholder={props.placeholder} style={[props.fontsStyle,{flex:0.8}]} />
            {props.revealPassword?
            // <View style={{alignItems:'flex-end', flex:0.2, justifyContent:"center", marginRight:hp('4.4%')}}>
                <TouchableOpacity style={{ flex:0.2, justifyContent:"center", alignItems:'center'}} onPress={()=>props.revealPassword()}>
                    <MaterialCommunityIcons size={hp('2.5%')} name={props.secureTextEntry?"eye-closed":"eye"} />
                    {/* <Text>Show</Text> */}
                </TouchableOpacity>
            // </View>
            :null
            }
        </View>
    )
}
