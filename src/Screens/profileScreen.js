import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  FlatList,
  TextInput,
  Image,
  StyleSheet
} from 'react-native';
import CustomHeader from '../components/shared/customHeader';
import ModalList from '../components/shared/commonModal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fetchTransaction} from '../actions/wallet';
import {CommonTextInput} from '../components/shared/customTextInputs';
import {connect} from 'react-redux';
import TransactionListTab from '../components/TransactionListComponent';
import {queryAllTransactions} from '../components/realmModels/transaction';
import {updateVCard} from '../helpers/xmppStanzaRequestMessages';
import * as connectionURL from '../config/url';

import {
  getUserProfileData,
  setUserInitialData,
  saveInitialData,
  saveInitialDataAction
} from '../actions/auth';
import Modal from 'react-native-modal';
import axios from 'axios';

import {commonColors, textStyles, coinImagePath, coinsMainName} from '../../docs/config';
export const changeUserName = async (data, token) => {
  console.log(data, 'datainnewname');
  return await axios.put(connectionURL.registerUserURL, data, {
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Authorization: token,
      'Accept-encoding': 'gzip, deflate',
    },
  });
};
const {
  primaryColor,
  primaryDarkColor
} = commonColors;

const {
  mediumFont,
  regularFont,
  boldFont,
  lightFont
} = textStyles;


const renderItem = ({item, index}) => (
  <Item
    tokenSymbol={item.tokenSymbol}
    tokenName={item.tokenName}
    balance={item.balance._hex?parseInt(item.balance._hex, 16):item.balance}
    index={index}
  />
);

const Item = ({tokenSymbol, tokenName, balance, index}) => (
  <View
    style={{
      height: hp('4.9%'),
      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
      justifyContent: 'center',
      padding: null,
    }}>
    <View style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flexDirection:"row", justifyContent:"flex-start", alignItems:"center", alignSelf:"flex-start"}}>
        <Image source={coinImagePath} style={styles.tokenIconStyle} /> 
          <Text
            style={{
              fontFamily: regularFont,
              fontSize: hp('1.97%'),
              color: '#000000',
            }}>
            {" "}{tokenSymbol}
          </Text>
        </View>
      </View>
      <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: regularFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {tokenName}
        </Text>
      </View>
      <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: mediumFont,
            fontSize: hp('1.97%'),
            color: '#000000',
          }}>
          {parseFloat(balance).toFixed(2)}
        </Text>
      </View>
    </View>
  </View>
);

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI:
        'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
      firstName: '',
      lastName: '',
      walletAddress: '',
      description: '',
      modalType: null,
      showModal: false,
      extraData: null,
      transactions: [],
      totalSent: 0,
      totalReceived: 0,
      assetCount: 1,
      transactionCount: 'Calculating...',
      activeTab: 0,
      xTabOne: 0,
      xTabTwo: 0,
      translateX: new Animated.Value(0),
      textColorAnim: new Animated.Value(0),
      coinBalance: 0,
      coinData: [],
      transactionObject: [],
      isDescriptionEditable: false,
      userAvatar: '',
      modalVisible: false,
      modalTypeForEditing: 'name',
    };
  }

  handleSlide = type => {
    let {translateX, textColorAnim} = this.state;
    textColorAnim.setValue(0);
    Animated.spring(translateX, {
      toValue: type,
      duration: 500,
      useNativeDriver: true
    }).start();
    Animated.timing(textColorAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true
    }).start();
  };

  loadTabContent = () => {
    let {activeTab, coinBalance, coinData} = this.state;
    if (activeTab === 0) {
      return (
        <View style={{marginTop: hp('3%')}}>
          <View style={{padding: hp('3%'), paddingBottom: 0, paddingTop: 0}}>
            <Text
              style={{
                fontSize: hp('1.97'),
                color: '#000000',
                fontFamily: boldFont,
              }}>
              Coins{' '}
              <Text
                style={{
                  fontSize: hp('1.47%'),
                  color: '#000000',
                  fontFamily: mediumFont,
                }}>
                ({parseFloat(coinBalance).toFixed(2)})
              </Text>
            </Text>
          </View>
          <View style={{marginTop: hp('1.47%')}}>
            <FlatList
              data={coinData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>

          {/* <Text
          style={{fontSize:hp("1.97"), color:"#000000", fontFamily:"Montserrat-Bold"}}>
            Items <Text style={{fontSize:hp("1.47%"), color:"#000000", fontFamily:"Montserrat-Medium"}}>({coinBalance})</Text></Text>
          <View style={{marginTop:hp("1.47%")}}>
            <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            />
          </View> */}
        </View>
      );
    }

    if (activeTab === 1) {
      return (
        <TransactionListTab
          transactions={this.state.transactionObject}
          walletAddress={this.state.walletAddress}
        />
      );
    }
  };

  componentDidMount() {
    let transactionsObject = [];
    let coinData = this.props.walletReducer.balance;
    let coinBalance = 0;
    // let transactions=[];
    let totalSent = 0;
    let totalReceived = 0;
    const initialData = this.props.loginReducer.initialData;
    let userAvatar = this.props.loginReducer.userAvatar;
    let firstName;
    let lastName;
    let description = '';
    let walletAddress;
    if (initialData) {
      // userAvatar = initialData.photo;
      firstName = initialData.firstName;
      lastName = initialData.lastName;
      walletAddress = initialData.walletAddress;
      description = this.props.loginReducer.userDescription;
    }

    coinData.map(item => {
      if(item.balance.hasOwnProperty("_hex")){
        coinBalance = coinBalance + parseInt(item.balance._hex,16);
      }else coinBalance = coinBalance + parseFloat(item.balance);
    });

    queryAllTransactions(coinsMainName).then(transactions => {
      let balance = 0;
      if (transactions.length > 0) {
        transactions.map(item => {
          if (item.from === this.state.walletAddress && item.from !== item.to) {
            item.balance = balance - item.value;
            balance = balance - item.value;
          } else if (item.from === item.to) {
            item.balance = balance
            balance = balance;
          } else {
            item.balance = balance + item.value;
            balance = balance + item.value;
          }
        });
        transactionsObject = transactions.reverse();
      }
    });

    // transactionsObject.map((item) => {
    //   if(item.tokenName === 'ChatTestToken'){
    //     transactions.push(item)
    //     if(item.from === walletAddress){
    //       totalSent = totalSent + item.value
    //     }else if(item.from !== walletAddress){
    //       totalReceived = totalReceived + item.value
    //     }
    //   }else return null
    // })

    this.setState({
      userAvatar,
      lastName,
      firstName,
      walletAddress,
      description,
      totalSent,
      totalReceived,
      coinData,
      coinBalance,
      transactionsObject,
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.walletReducer.transactions !==
      this.props.walletReducer.transactions
    ) {
      queryAllTransactions(coinsMainName).then(transactions => {
        let balance = 0;
        if (transactions.length > 0) {
          transactions.map(item => {
            if (
              item.from === this.state.walletAddress &&
              item.from !== item.to
            ) {
              item.balance = balance - item.value;
              balance = balance - item.value;
            } else if (item.from === item.to) {
              item.balance = balance;
              balance = balance;
            } else {
              item.balance = balance + item.value;
              balance = balance + item.value;
            }
          });
        }

        this.setState({
          transactionObject: transactions.reverse(),
          transactionCount: transactions.length,
        });
      });
    }

    if (
      this.props.loginReducer.userAvatar &&
      this.props.loginReducer.userAvatar !== prevProps.loginReducer.userAvatar
    ) {
      this.setState({
        userAvatar: this.props.loginReducer.userAvatar,
      });
    }
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  QRPressed = () => {
    let walletAddress = this.state.walletAddress;
    this.setState({
      showModal: true,
      modalType: 'generateQR',
      extraData: walletAddress,
    });
  };

  onNamePressed = () => {
    this.setState({
      modalTypeForEditing: 'name',
      modalVisible: true,
    });
  };
  onNameChange = (type, text) => {
    this.setState({
      [type]: text,
    });
  };
  setNewName = () => {
    changeUserName(
      {firstName: this.state.firstName, lastName: this.state.lastName},
      this.props.loginReducer.token,
    )
      .then(res =>
        // this.props.setUserInitialData({
        //   firstName: this.state.firstName,
        //   lastName: this.state.lastName,
        //   image: this.props.loginReducer.initialData.image,
        //   username: this.props.loginReducer.initialData.username,

        //   password: this.props.loginReducer.initialData.password,

        //   walletAddress: this.props.loginReducer.initialData.walletAddress,
        // }),
        saveInitialData(
          { firstName: this.state.firstName,
            lastName: this.state.lastName,
            image: this.props.loginReducer.initialData.image,
            username: this.props.loginReducer.initialData.username,
  
            password: this.props.loginReducer.initialData.password,
  
            walletAddress: this.props.loginReducer.initialData.walletAddress,},
          callback => {
            this.props.saveInitialDataAction(callback);
            // dispatch(loginUserSuccess(data));
          },
        )
      )
      .catch(e => console.log(e, 'nameerror'));
    // this.props.getUserProfileData(this.props.loginReducer.token)

    this.setState({modalVisible: false});
  };
  onDescriptionPressed = () => {
    this.setState({
      isDescriptionEditable: !this.state.isDescriptionEditable,
      modalVisible: true,
    });
  };
  setDescription = data => {
    updateVCard(this.state.userAvatar, data);
    this.setState({isDescriptionEditable: false, modalVisible: false});
  };
  onDescriptionChange = text => {
    this.setState({description: text});
  };
  onBackdropPress = () => {
    this.setState({
      isDescriptionEditable: !this.state.isDescriptionEditable,
      modalVisible: false,
    });
  };
  modalContent = () => {
    if (this.state.modalTypeForEditing === 'description') {
      return this.state.isDescriptionEditable ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingVertical: 20,
          }}>
          <CommonTextInput
            maxLength={128}
            containerStyle={{
              borderWidth: 0.5,
              // borderTopWidth: 0,
              borderColor: primaryColor,
              backgroundColor: 'white',
              width: wp('81%'),
              height: hp('6.8%'),
              // padding: hp('2.4'),
              paddingLeft: wp('3.73'),
              borderRadius: 0,
              marginBottom: 10,
              // marginTop: 10
            }}
            fontsStyle={{
              fontFamily: lightFont,
              fontSize: hp('1.6%'),
              color: 'black',
            }}
            value={this.state.description}
            onChangeText={text => this.onDescriptionChange(text)}
            placeholder="Enter your description"
            placeholderTextColor={primaryColor}
          />

          <TouchableOpacity
            onPress={() => this.setDescription(this.state.description)}
            style={{
              backgroundColor: primaryColor,
              borderRadius: 5,
              height: hp('4.3'),
              padding: 4,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <Text style={styles.createButtonText}>Done editing</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null;
    }

    if (this.state.modalTypeForEditing === 'name') {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 8,
            paddingVertical: 20,
          }}>
          <CommonTextInput
            maxLength={15}
            containerStyle={{
              borderWidth: 0.5,
              // borderTopWidth: 0,
              borderColor: primaryColor,
              backgroundColor: 'white',
              width: wp('81%'),
              height: hp('6.8%'),
              // padding: hp('2.4'),
              paddingLeft: wp('3.73'),
              borderRadius: 0,
              marginBottom: 10,
              // marginTop: 10
            }}
            fontsStyle={{
              fontFamily: lightFont,
              fontSize: hp('1.6%'),
              color: 'black',
            }}
            value={this.state.firstName}
            onChangeText={text => this.onNameChange('firstName', text)}
            placeholder="Enter your firstname"
            placeholderTextColor={primaryColor}
          />
          <CommonTextInput
            maxLength={15}
            containerStyle={{
              borderWidth: 0.5,
              // borderTopWidth: 0,
              borderColor: primaryColor,
              backgroundColor: 'white',
              width: wp('81%'),
              height: hp('6.8%'),
              // padding: hp('2.4'),
              paddingLeft: wp('3.73'),
              borderRadius: 0,
              marginBottom: 10,
              // marginTop: 10
            }}
            fontsStyle={{
              fontFamily: lightFont,
              fontSize: hp('1.6%'),
              color: 'black',
            }}
            value={this.state.lastName}
            onChangeText={text => this.onNameChange('lastName', text)}
            placeholder="Enter your lastname"
            placeholderTextColor={primaryColor}
          />
          <TouchableOpacity
            onPress={() => this.setNewName()}
            style={{
              backgroundColor: primaryColor,
              borderRadius: 5,
              height: hp('4.3'),
              padding: 4,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <Text style={styles.createButtonText}>Done editing</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };
  render() {
    let {
      xTabOne,
      xTabTwo,
      translateX,
      firstName,
      lastName,
    } = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{backgroundColor: primaryDarkColor, flex: 1}}>
          <CustomHeader
            isQR={true}
            title="My profile"
            onQRPressed={() => this.QRPressed()}
            navigation={this.props.navigation}
          />

          {/* Profile Picture */}
          <View style={{zIndex: +1, alignItems: 'center'}}>
            <View
              style={{
                width: hp('10.46%'),
                height: hp('10.46%'),
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: primaryColor,
                borderRadius: hp('10.46%') / 2,
              }}>
              {this.state.userAvatar ? (
                <Image
                  source={{uri: this.state.userAvatar}}
                  style={{
                    height: hp('10.46%'),
                    width: hp('10.46%'),
                    borderRadius: hp('10.46%') / 2,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: hp('4.92%'),
                    color: 'white',
                  }}>
                  {firstName[0] + lastName[0]}
                </Text>
              )}
            </View>
          </View>
          {/* Profile Picture */}

          <View style={{flex: 1, marginTop: hp('5.5%')}}>
            <View
              style={{
                paddingTop: hp('2.4%'),
                backgroundColor: '#FBFBFB',
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                height: hp('75%'),
              }}>
              <View style={{alignItems: 'center', marginTop: hp('5.54%')}}>
              <TouchableOpacity onPress={this.onNamePressed}>
                  <Text
                    style={{
                      fontSize: hp('2.216%'),
                      fontFamily: mediumFont,
                      color: '#000000',
                    }}>
                    {firstName} {lastName}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{padding: hp('4%'), paddingBottom: 0, paddingTop: 0}}>
                  <View
                    style={{
                      padding: hp('4%'),
                      paddingBottom: 0,
                      paddingTop: 0,
                    }}>
                    <TouchableOpacity>
                      <Text
                        onPress={this.onDescriptionPressed}
                        style={{
                          fontSize: hp('2.23%'),
                          fontFamily: regularFont,
                          textAlign: 'center',
                          color: primaryDarkColor,
                        }}>
                        {this.state.description &&
                        !this.state.isDescriptionEditable
                          ? this.state.description
                          : 'Add your description'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View>
                <View style={{padding: wp('4%')}}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onLayout={event =>
                        this.setState({xTabOne: event.nativeEvent.layout.x})
                      }
                      onPress={() =>
                        this.setState({activeTab: 0}, () =>
                          this.handleSlide(xTabOne),
                        )
                      }>
                      <Animated.Text
                        style={{
                          fontSize: hp('1.97%'),
                          fontFamily: boldFont,
                          color:
                            this.state.activeTab === 0
                              ? '#000000'
                              : '#0000004D',
                        }}>
                        Assets ({this.state.assetCount})
                      </Animated.Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{marginLeft: 20}}
                      onLayout={event =>
                        this.setState({xTabTwo: event.nativeEvent.layout.x})
                      }
                      onPress={() =>
                        this.setState({activeTab: 1}, () =>
                          this.handleSlide(xTabTwo),
                        )
                      }>
                      <Animated.Text
                        style={{
                          fontSize: hp('1.97%'),
                          fontFamily: boldFont,
                          color:
                            this.state.activeTab === 1
                              ? '#000000'
                              : '#0000004D',
                        }}>
                        Transactions ({this.state.transactionCount})
                      </Animated.Text>
                    </TouchableOpacity>
                  </View>

                  <Animated.View
                    style={{
                      width: wp('10%'),
                      borderWidth: 1,
                      transform: [
                        {
                          translateX,
                        },
                      ],
                    }}
                  />
                </View>

                {this.loadTabContent()}
              </View>
            </View>
            <ModalList
              type={this.state.modalType}
              show={this.state.showModal}
              extraData={this.state.extraData}
              closeModal={this.closeModal}
            />
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: 'black',
                alignItems: 'center',
                height: '100%',
              }}>
              <Modal
                animationType="slide"
                transparent={true}
                isVisible={this.state.modalVisible}
                onBackdropPress={this.onBackdropPress}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                }}>
                {this.modalContent()}
              </Modal>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(
  mapStateToProps,
  {
    fetchTransaction,
    // fetchWalletBalance,
    getUserProfileData,
    setUserInitialData,
    saveInitialData,
    saveInitialDataAction
  },
)(ProfileScreen);


const styles = StyleSheet.create({
  tokenIconStyle:{
    height: hp("3%"),
    width: hp("3%")
  }
})
