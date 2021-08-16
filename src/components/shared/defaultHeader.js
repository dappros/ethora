import React, { Component } from 'react'
import {StyleSheet, SafeAreaView, Image, TouchableOpacity, Platform, View, Text} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from "react-redux";
import {fetchWalletBalance, transferTokens, fetchTransaction} from '../../actions/wallet';
import {retrieveInitialData, logOut, pushSubscription} from '../../actions/auth';
import {sendSearchText} from '../../actions/searchAction';
import Menu, { MenuItem } from 'react-native-material-menu';
import * as XmppConstant from '../../constants/xmppConstants';
import {setRosterAction, setRecentRealtimeChatAction, finalMessageArrivalAction, participantsUpdateAction} from '../../actions/chatAction';
import {coinsMainName} from '../../../docs/config';
import {underscoreManipulation} from '../../helpers/underscoreLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { xmpp } from '../../helpers/xmppCentral';
import {
    logoPath,
    appTitle, 
    commonColors,
    textStyles,
    coinImagePath,
    navbarLogoShow,
    tutorialShowInMenu
} from '../../../docs/config';

const {primaryColor} = commonColors;
const {mediumFont} = textStyles
class HeaderComponent extends Component{
    constructor(props){
        super(props)
        this.state = {
            balance:0,
            name:"",
            tokenName:coinsMainName,
            tokenDetails:[],
            showModal:false,
            text:null,
            walletAddress:"",
            manipulatedWalletAddress:"",
            username:"",
            pushToken:""
        }

        
    }

    async componentDidMount(){
        let pushToken = this.props.pushToken;
        let walletAddress = "";
        let firstName = "";
        let lastName = "";
        let username = "";
        let screenName="";
        let manipulatedWalletAddress
        await this.props.retrieveInitialData().then(()=>{
        const initialData = this.props.loginReducer.initialData;
        walletAddress = initialData.walletAddress;
        manipulatedWalletAddress = underscoreManipulation(walletAddress);
        firstName = initialData.firstName;
        lastName = initialData.lastName;
        username = initialData.username;
        screenName = firstName+" "+lastName
        // let balance="0"
        // if(this.props.walletReducer.balance){
        //     this.props.walletReducer.balance.map((item)=>{
        //         if(item.tokenName===coinsMainName){
        //             if(item.balance.hasOwnProperty("_hex")){
        //                 balance =  parseInt(item.balance._hex, 16);
        //             }else balance = item.balance;
        //         }
        //     })
        // }
        this.setState({
            screenName,
            walletAddress,
            username,
            manipulatedWalletAddress,
            // balance,
            pushToken
        })
        })

        if(pushToken)
        { 
            this.props.pushSubscription(
                {
                    appId:"GKConnect",
                    deviceId: pushToken,
                    deviceType: Platform.OS==="ios"?"0":"1",
                    environment:"Production",
                    externalId:"",
                    isSubscribed:"1",
                    jid:manipulatedWalletAddress+"@"+XmppConstant.DOMAIN,
                    screenName:screenName
                }
            )
        }
    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.walletReducer.balance!==undefined&&this.props.walletReducer.balance){
            let balance = 0
            let tokenName = "";
            this.props.walletReducer.balance.map((item,index)=>{
                if(item.tokenName===coinsMainName){
                    if(parseInt(item.balance) !== this.state.balance){
                        balance = Math.round(item.balance*100)/100;
                        tokenName = item.tokenName;
                        this.setState({
                            balance,
                            tokenName
                        })
                    }
                }
            })
        }

        if(this.props.walletReducer.transactions&&this.props.walletReducer.transactions.length!=prevProps.walletReducer.transactions.length){
            this.props.fetchWalletBalance(this.state.walletAddress, null, this.props.loginReducer.token, true);
        }
    }


    //close the modal
    closeModal = (tokenName,balance)=>{
        let roundBalance = Math.round(balance*100)/100
        this.setState({
            showModal:false,
            tokenName,
            balance:roundBalance
        })
    }

    updateSearch(text){
        this.setState({text})
        this.props.sendSearchText(text)
    }

    // _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    openWallet = async()=>{
        let initialData = this.props.loginReducer.initialData;
        let walletAddress = initialData.walletAddress
        await this.props.fetchTransaction(walletAddress,this.props.loginReducer.token, true)
    }

    onPressGem = async () =>{
        await this.openWallet()
        this.props.navigation.navigate('ProfileComponent')
    }

    openKebabItem = (type) => {
        switch(type){
            case 'newChat':
                this.props.navigation.navigate('CreateNewChatComponent')
                this.hideMenu()
                break;

            case 'profile':
                this.hideMenu()
                this.openWallet()
                this.props.navigation.navigate('ProfileComponent')
                break;
            
            case 'transaction':
                this.hideMenu();
                this.openWallet();
                this.props.navigation.navigate('TransactionComponent');
                break;

            case 'settings':
                this.hideMenu();
                this.props.navigation.navigate('SettingsComponent');
                break;

            case 'scan':
                this.hideMenu();
                this.props.navigation.navigate('QRScreenComponent');
                break;

            case 'myQr':
                this.hideMenu();
                this.props.navigation.navigate('QRGenScreenComponent');
                break;

            case 'mint':
                this.hideMenu();
                this.props.navigation.navigate('MintItemsComponent');
                break;

            case "tutorial":
                AsyncStorage.setItem('@skipForever', "0")
                this.hideMenu();
                this.props.navigation.navigate('AppIntroComponent');
                break;

            case "account":
                this.hideMenu();
                this.props.navigation.navigate('AccountComponent');
                break;

            case 'logOut':
                this.hideMenu();
                xmpp.stop().catch(console.error);
                this.props.logOut()
                break;
                // this.props.navigation.navigate('CreatNewChatComponent')


            default:
                return null
        }
    }
    
    render(){
        return(
            <View style={{backgroundColor: primaryColor, paddingBottom:0, justifyContent:'center'}}>
                <SafeAreaView style={styles.container}>
                    <View style={{flex:1, flexDirection:'row', alignItems:'center', height:hp('10%'), margin:8, marginRight:wp("0%")}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("ChatHomeComponent")} style={{ flex:0.1, justifyContent:'center', alignItems:'center', margin:5, marginLeft:wp("3%"), marginRight:18}}>
                            <View style={{height:hp('7%'), width:hp('7%'), borderRadius:hp('7%')/2, borderWidth:1, borderColor:"#FFFF", justifyContent:'center', alignItems:'center'}}>
                            {   
                                navbarLogoShow? 
                                <Image style={{width:hp('7%'), height:hp('7%')}} source={logoPath} />:
                                null
                            }
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex:0.6, justifyContent: 'center', alignItems:'flex-start',marginLeft:wp('2.13%')}}>
                            <Text style={{fontSize:hp('3%'), color:"#ffff", fontFamily:mediumFont}}>{appTitle}</Text>
                        </View>
                        <View style={{ flex:0.3, flexDirection:'row'}}>

                            <TouchableOpacity onPress={()=>this.onPressGem()} style={[styles.diamondContainer]}>
                                <View style={{backgroundColor:"#FFFFFF",width:wp('14%'),height:wp('12%'),borderRadius:5,justifyContent:'center',alignItems:'center',}}>
                                <Image source={coinImagePath} style={styles.gkcIconStyle}/>
                                <Text style={{color:primaryColor, fontFamily:mediumFont, fontSize:hp('1.97%')}}>{this.state.balance}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.showMenu} style={{flex:0.5,justifyContent:'center', alignItems:'center', width:wp('20%'), marginLeft:wp("1%")}}>
                            <Menu
                            ref={ref=>this._menu = ref}
                            button={
                            <View><Icon name="ellipsis-v" color="#FFFFFF" size={hp('3%')} /></View>}
                            >
                                <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('newChat')}>New chat</MenuItem>
                                <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('profile')}>My profile</MenuItem>
                                <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('transaction')}>Transactions</MenuItem>
                                {/* <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('settings')}>Settings</MenuItem> */}
                                {/* <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('account')}>Account</MenuItem> */}
                                <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('scan')}>Scan</MenuItem>
                                <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('mint')}>Mint items</MenuItem>
                                {/* <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('myQr')}>My QR</MenuItem> */}
                                {
                                    tutorialShowInMenu?
                                    <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('tutorial')}>Tutorial</MenuItem>:
                                    null
                                }
                                <MenuItem textStyle={styles.menuTextStyle} onPress={()=>this.openKebabItem('logOut')}>Log out</MenuItem>
                            </Menu>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={()=>this.openKebab()} style={{justifyContent:'center', alignItems:'flex-end', marginLeft:25}}>
                                <Icon name="ellipsis-v" color="#FFFFFF" size={hp('3%')} />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:wp('100%'),
        height:Platform.OS=='ios'? hp('14%'):hp('10%'),
    },
    diamondContainer:{
        flex:0.5,
        width:wp('14%'),
        height:wp('12%'),
        alignSelf:'center',
        shadowColor:"#00000040",
        shadowOffset:{width:5,height:5},
        shadowOpacity:1
    },
    menuTextStyle:{
        color:'#000000',
        fontFamily:mediumFont,
        fontSize:hp('1.6%')
    },
    gkcIconStyle: {
        height: hp("3%"),
        width: hp("3%")
    },
})

const mapStateToProps = state => {
    return {
      ...state,
    };
};

module.exports = connect(mapStateToProps,{
    fetchWalletBalance,
    retrieveInitialData,
    transferTokens,
    sendSearchText,
    fetchTransaction,
    logOut,
    setRosterAction,
    setRecentRealtimeChatAction,
    finalMessageArrivalAction,
    participantsUpdateAction,
    pushSubscription
})(HeaderComponent)