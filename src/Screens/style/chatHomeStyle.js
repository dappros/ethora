/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {commonColors, textStyles} from '../../../docs/config';

const {
    primaryColor
} = commonColors

const {
    regularFont,
    mediumFont,
} = textStyles

export default {
    container:{
        flex:1,
        backgroundColor:'white'
    },
    emptyChatContainer:{
        flex:1,
        alignItems:'center', 
        marginTop:hp('10%')
    },
    noChatText:{
        color:primaryColor,
        fontSize:hp('2.5%'),
        fontFamily:mediumFont
    },
    descText:{
        color:'#121212',
        fontSize:hp('1.8%'),
        textAlign:'center',
        fontFamily:mediumFont
    },
    button1:{
        color:'#FFFFFF',
        fontSize:hp('1.8%'),
        fontFamily:regularFont
    },
    button2:{
        color:primaryColor,
        fontSize:hp('1.8%'),
        fontFamily:regularFont
    },
    button1Container:{
        width:wp('35%'),
        height:hp('6%'),
        backgroundColor:primaryColor,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:3,
        marginRight:12
    },
    button2Container:{
        width:wp('35%'),
        height:hp('6%'),
        borderColor:primaryColor,
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:3,
        marginLeft:12
    }
}
