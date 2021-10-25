/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {fetchchatRoomDetails, shouldCountAction} from '../../actions/chatAction';
import {fetchRosterList} from '../../components/realmModels/chatList';
import { connect } from 'react-redux';
import {commonColors, textStyles} from '../../../docs/config';

const {primaryDarkColor} = commonColors;

const {
mediumFont
} = textStyles

class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title:"",
        chatRoomDetails:{
            chat_id:"",
            chat_name:""
        }
    };
  }
  
    componentDidMount(){
        if(this.props.title){
            this.setState({title:this.props.title})
        }else
        {
            let chatRoomDetails = this.props.ChatReducer.chatRoomDetails?this.props.ChatReducer.chatRoomDetails:this.state.chatRoomDetails
            this.setState({
            chatRoomDetails
            })
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.ChatReducer.isRosterUpdated){
            fetchRosterList().then(rosterListFromRealm=>{
                rosterListFromRealm.map(item => {
                    if(item.jid===this.state.chatRoomDetails.chat_jid&&item.name!==this.state.chatRoomDetails.chat_jid){
                        // alert("sdasdcasx")
                        this.setState({
                            title:item.name
                        })
                    }
                })
            })
        }
    }


  static getDerivedStateFromProps(nextProp, prevState){
    if(nextProp.ChatReducer.chatRoomDetails!==prevState.chatRoomDetails)
    {
        return{chatRoomDetails:nextProp.ChatReducer.chatRoomDetails}
    }
    else if(nextProp.title){
        return{title:nextProp.title}
    }
    else
        return null
  }

  openFilterMenu= () =>{
      
  }

  goBack=()=>{
    // if(this.props.isExitRoom()){
    //     this.props.isExitRoom()
    // }
    this.props.shouldCountAction(true)
    // this.props.navigation.navigate('ChatHomeComponent');
    this.props.navigation.goBack();
  }


  render() {
    let name = ""
    if(this.state.title){
        name = this.state.title
    }
    else if(this.props.title){
        name=this.props.title
    }else{
        name = this.state.chatRoomDetails.chat_name
    }
    // let name = this.state.chatRoomDetails.name
    return (
        <View>
            <View style={{
                width:wp('100%'), 
                backgroundColor:primaryDarkColor,
                height:hp('7.5%'),
                justifyContent:'center'
            }}>
                <View style={{
                    alignItems:'center',
                    flex:1,
                    flexDirection:'row'
                }}>
                    <TouchableOpacity onPress={()=>this.goBack()} style={{
                        flex:0.8,
                        flexDirection:'row',
                        alignItems:'center',
                        marginLeft:10
                    }}>

                        <AntIcon
                        color="#FFFF"
                        name='arrowleft'
                        size={hp('3%')}
                        style={{marginRight:5}}
                        />
                        <Text style={{
                            color:'#FFFF',
                            fontFamily:mediumFont,
                            fontSize:hp('1.8%')
                        }}>{name}</Text>

                    </TouchableOpacity>
                    {this.props.isQR &&
                        <TouchableOpacity
                        onPress={()=>this.props.onQRPressed()} 
                        style={{flex:0.2, alignItems:'flex-end', marginRight:10}}>
                            <Icon name="qrcode" color="#FFFF" size={hp('3.7%')} />
                        </TouchableOpacity>
                    }
                    {
                        this.props.type==='transaction'?
                        <TouchableOpacity
                        onPress={()=>this.openFilterMenu()}
                        style={{flex:0.2, alignItems:'flex-end', marginRight:10}}>
                            <AntIcon name="filter" color="#FFFF" size={hp('3%')} />
                        </TouchableOpacity>:null
                    }
                </View>
            </View>
        </View>
    );
  }
}


const mapStateToProps = state => {
    return {
        ...state,
    };
};

module.exports = connect(mapStateToProps,{
    fetchchatRoomDetails,
    shouldCountAction
})(CustomHeader)
