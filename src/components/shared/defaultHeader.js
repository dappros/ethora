/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  fetchWalletBalance,
  transferTokens,
  fetchTransaction,
} from '../../actions/wallet';
import {
  retrieveInitialData,
  logOut,
  pushSubscription,
} from '../../actions/auth';
import {toggleDebugMode} from '../../actions/debugActions';
import {sendSearchText} from '../../actions/searchAction';
import Menu, {MenuItem} from 'react-native-material-menu';

import {coinsMainName, itemsMintingAllowed} from '../../../docs/config';
import {underscoreManipulation} from '../../helpers/underscoreLogic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {xmpp} from '../../helpers/xmppCentral';
import {
  logoPath,
  appTitle,
  commonColors,
  textStyles,
  coinImagePath,
  navbarLogoShow,
  tutorialShowInMenu,
} from '../../../docs/config';

const {primaryColor} = commonColors;
const {mediumFont} = textStyles;

// import React from 'react'

const menuItems = debug => [
  {value: 'newChat', label: 'New chat', visible: true},
  {value: 'profile', label: 'My profile', visible: true},
  {value: 'transaction', label: 'Transactions', visible: true},
  // {value: 'settings', label: 'Settings', visible: true},
  {value: 'scan', label: 'Scan', visible: true},
  // {value: 'myQr', label: 'QR', visible: true},
  {value: 'mint', label: 'Mint items', visible: itemsMintingAllowed},
  {value: 'tutorial', label: 'Tutorial', visible: tutorialShowInMenu},
  {value: 'account', label: 'Account', visible: true},
  {value: 'debug', label: 'Debug', visible: debug},
  {value: 'logOut', label: 'Logout', visible: true},
];

export const DefaultHeader = ({pushToken, navigation}) => {
  // const [tokenname, setTokenName] = useState(coinsMainName);
  // const [text, setText] = useState('');
  // const [pushToken1, setPushToken] = useState('');
  const [balance, setBalance] = useState(null);
  const [debugModeCounter, setDebugModeCounter] = useState('');
  const [loading, setLoading] = useState(false);

  const apiReducer = useSelector(state => state.apiReducer);
  const loginReducer = useSelector(state => state.loginReducer);
  const walletReducer = useSelector(state => state.walletReducer);
  const debugReducer = useSelector(state => state.debugReducer);
  const manipulatedWalletAddress = underscoreManipulation(
    loginReducer.initialData.walletAddress,
  );
  const menuRef = useRef();

  const dispatch = useDispatch();

  const enableDebugMode = () => {
    if (debugModeCounter >= 2) {
      dispatch(toggleDebugMode(true));
    }
    setDebugModeCounter(prev => prev + 1);
  };
  const cacheBalance = async updatedBalance => {
    await AsyncStorage.setItem('userBalance', JSON.stringify(updatedBalance));
  };

  const subscribePush = () => {
    dispatch(
      pushSubscription({
        appId: 'Ethora',
        deviceId: pushToken,
        deviceType: Platform.OS === 'ios' ? '0' : '1',
        environment: 'Production',
        externalId: '',
        isSubscribed: '1',
        jid: manipulatedWalletAddress + '@' + apiReducer.xmppDomains.DOMAIN,
        screenName:
          loginReducer.initialData.firstName +
          ' ' +
          loginReducer.initialData.lastName,
      }),
    );
  };

  const getInitialData = async () => {


    dispatch(retrieveInitialData());
    const cachedBalance = await AsyncStorage.getItem('userBalance');
    if (cachedBalance) {
      setBalance(JSON.parse(cachedBalance));
    }

    if (pushToken) subscribePush();
  };
  const computeWalletBalance = async () => {
    let token = '';
    walletReducer.balance.map((item, index) => {
      if (item.tokenName === coinsMainName) {
        const tokenBalance = Math.round(item.balance * 100) / 100;
        token = item.tokenName;
        cacheBalance(tokenBalance);
        setBalance(tokenBalance);
      }
    });

    // setTokenName(token);
  };

  const openWallet = () => {
    dispatch(
      fetchTransaction(
        loginReducer.initialData.walletAddress,
        loginReducer.token,
        true,
      ),
    );
  };
  const updateSearch = text => {
    // setText(text);
    dispatch(sendSearchText(text));
  };

  // _menu = null;

  const hideMenu = () => {
    menuRef.current.hide();
  };

  const showMenu = () => {
    menuRef.current.show();
  };
  const onPressGem = async () => {
    openWallet();
    navigation.navigate('ProfileComponent');
  };

  const openKebabItem = type => {
    switch (type) {
      case 'newChat':
        navigation.navigate('CreateNewChatComponent');
        break;

      case 'profile':
        openWallet();
        navigation.navigate('ProfileComponent');
        break;

      case 'transaction':
        openWallet();
        navigation.navigate('TransactionComponent');
        break;

      case 'settings':
        navigation.navigate('SettingsComponent');
        break;

      case 'scan':
        navigation.navigate('QRScreenComponent');
        break;

      case 'myQr':
        navigation.navigate('QRGenScreenComponent');
        break;

      case 'mint':
        navigation.navigate('MintItemsComponent');
        break;

      case 'tutorial':
        AsyncStorage.setItem('@skipForever', '0');

        navigation.navigate('AppIntroComponent');
        break;

      case 'account':
        navigation.navigate('AccountComponent');
        break;
      case 'debug':
        navigation.navigate('DebugScreenComponent');
        break;

      case 'logOut':
        xmpp.stop().catch(console.error);
        dispatch(logOut());
        break;
      // this.props.navigation.navigate('CreatNewChatComponent')

      default:
        return null;
    }
    hideMenu();
  };
  useEffect(() => {
    getInitialData();
    return () => {};
  }, []);

  useEffect(() => {
    computeWalletBalance();
    return () => {};
  }, [walletReducer.balance]);

  // useEffect(() => {
  //   dispatch(
  //     fetchWalletBalance(
  //       loginReducer.initialData.walletAddress,
  //       null,
  //       loginReducer.token,
  //       true,
  //     ),
  //   );
  //   return () => {};
  // }, [walletReducer.transactions.length]);

  return (
    <View style={styles.main}>
      <SafeAreaView style={styles.container}>
        <View style={styles.navContainer}>
          {!!navbarLogoShow && (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatHomeComponent')}
              style={styles.logoButton}>
              <View style={styles.logoContainer}>
                <Image
                  style={{width: hp('7%'), height: hp('7%')}}
                  source={logoPath}
                />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={enableDebugMode}
            activeOpacity={0.9}
            style={{
              flex: navbarLogoShow ? 0.6 : 0.7,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.titleText}>{appTitle}</Text>
          </TouchableOpacity>
          <View style={{flex: 0.3, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={onPressGem}
              style={[styles.diamondContainer]}>
              <View
                style={[
                  styles.balanceContainer,
                  {
                    backgroundColor:
                      !loading && !walletReducer.balance.length
                        ? 'grey'
                        : '#fff',
                  },
                ]}>
                <Image source={coinImagePath} style={styles.iconStyle} />
                {loading || (!balance && balance !== 0) ? (
                  <ActivityIndicator size="small" color={primaryColor} />
                ) : (
                  <Text
                    style={[
                      styles.balanceText,
                      {
                        color:
                          !loading && !walletReducer.balance.length
                            ? 'lightgrey'
                            : primaryColor,
                      },
                    ]}>
                    {balance}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={showMenu} style={styles.menuButton}>
              <Menu
                ref={menuRef}
                button={
                  <View>
                    <Icon name="ellipsis-v" color="#FFFFFF" size={hp('3%')} />
                  </View>
                }>
                {menuItems(debugReducer.debugMode).map(item => {
                  if (item.visible) {
                    return (
                      <MenuItem
                        key={item.value}
                        textStyle={styles.menuTextStyle}
                        onPress={() => openKebabItem(item.value)}>
                        {item.label}
                      </MenuItem>
                    );
                  }
                })}
              </Menu>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={()=>this.openKebab()} style={{justifyContent:'center', alignItems:'flex-end', marginLeft:25}}>
                                <Icon name="ellipsis-v" color="#FFFFFF" size={hp('3%')} />
                            </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: primaryColor,
    paddingBottom: 0,
    justifyContent: 'center',
  },
  container: {
    width: wp('100%'),
    height: Platform.OS == 'ios' ? hp('14%') : hp('10%'),
  },
  balanceContainer: {
    backgroundColor: '#FFFFFF',
    width: wp('14%'),
    height: wp('12%'),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('10%'),
    margin: 8,
    marginRight: wp('0%'),
  },
  logoContainer: {
    height: hp('7%'),
    width: hp('7%'),
    borderRadius: hp('7%') / 2,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoButton: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginLeft: wp('3%'),
    marginRight: 18,
  },
  diamondContainer: {
    flex: 0.5,
    width: wp('14%'),
    height: wp('12%'),
    alignSelf: 'center',
    shadowColor: '#00000040',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 1,
    marginLeft: navbarLogoShow ? 0 : hp('1.2%'),
  },
  menuTextStyle: {
    color: '#000000',
    fontFamily: mediumFont,
    fontSize: hp('1.6%'),
  },
  titleText: {
    fontSize: hp('3%'),
    color: '#ffff',
    fontFamily: mediumFont,
  },
  balanceText: {
    color: primaryColor,
    fontFamily: mediumFont,
    fontSize: hp('1.97%'),
  },
  menuButton: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('20%'),
    marginLeft: wp('1%'),
  },
  iconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
});
export default DefaultHeader;
