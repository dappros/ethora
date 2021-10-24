/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export default {

containerView: {
    flex: 1,
    backgroundColor:'#FFFFFF',
    padding: hp('1.5%'),
},
loginScreenContainer: {
    flex: 1,
    // margin: 10,
    justifyContent:'center',
},
logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: 'center',
},
loginFormView: {
    flex: 1,
    justifyContent:'center',
    marginTop:15,
    alignItems: 'center',
},
loginFormTextInput: {
    height:hp('7%'),
    width:wp('80%'),
    fontSize: hp('1.7%'),
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,

},
loginButton: {
    backgroundColor: '#2775EA',
    borderRadius: 5,
    height:hp('7%'),
    width:wp('80%'),
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
},
loginButtonText: {
    fontSize:14,
    color:"#fff"
},
fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
},
googleSignInButton:{
    flexDirection:'row',
    height:hp('7%'),
    backgroundColor:"#2775EA",
    width:wp('80%'),
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center' 
}
};
