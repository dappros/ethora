/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {commonColors, textStyles} from '../../../docs/config';

const {primaryColor} = commonColors;
const {regularFont, lightFont} = textStyles;

export default {
    container:{
        flex:1,
        backgroundColor: "white",
    },
    contentContainer:{
        flex:1,
        margin: 20,
        marginTop:0
    },
    camOuter:{
        width:wp('15%'),
        height:wp('15%'),
        borderRadius:wp('15%')/2,
        borderColor: primaryColor,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:wp('5%')
    },
    section1:{
        flexDirection: 'row',
        marginTop:20
    },
    textInputOuter:{
        color:"#000000",
        borderWidth:1,
        borderColor:primaryColor,
        borderRadius:5,
        flex:0.8,
        backgroundColor:primaryColor+"26",
        paddingLeft:20,
        alignItems: 'flex-start',
        height:wp('15%'),
        fontFamily: lightFont,
        fontSize:hp('1.8%')
    },
    textFieldouter:{
        color:"#000000",
        borderWidth:1,
        height:wp('35%'),
        borderColor:primaryColor,
        backgroundColor:primaryColor+"26",
        borderRadius:5,
        marginTop:20,
        fontFamily: lightFont,
        fontSize:hp('1.8%'),
        paddingLeft:20,
    },
    section2:{
        flex:1,
        marginTop:20,
        width:'100%',
    },
    createButton: {
        backgroundColor: primaryColor,
        borderRadius: 5,
        height:hp('7%'),
        marginTop:20
    },
    createButtonText: {
        fontSize:hp('2%'),
        color:"#fff",
        fontFamily: regularFont
    },
}
