import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import CustomHeader from '../components/shared/customHeader';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Tooltip from 'react-native-walkthrough-tooltip';
import {
  getEmailList,
  addEmailToList,
  deletEmailFromList,
  setISPremium,
} from '../actions/accountAction';
import {logOut} from '../actions/auth';
import * as connectionURL from '../config/url';
import fetchFunction from '../config/api';
import {gkHubspotToken} from '../config/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {commonColors, defaultChats, textStyles} from '../../docs/config';

const {primaryColor, primaryDarkColor} = commonColors;
const {mediumFont, regularFont, boldFont, lightFont} = textStyles;

const hitAPI = new fetchFunction();
const _ = require('lodash');

const toolTipContentText =
  'Please check your inbox for the verification email and follow the instructions in the email to verify this email address.';
const newEmailAddedAlertText =
  " added to your profile's e-mail addresses. We have sent you a verification link to that address. Please open it to confirm this e-mail belongs to you.";
const emailRemovedAlertText = " removed from your profile's e-mail addresses.";

function EmailListComponent(
  emailList,
  toolTipVisible,
  setToolTipState,
  deleteEmail,
) {
  const {email, verified} = emailList.item;
  const index = emailList.index;
  return (
    <View key={index} style={[style.emailListComponentContainerStyle]}>
      <View style={style.emailDisplayBoxContainer}>
        <Text style={style.emailDisplayTextStyle}>{email}</Text>
      </View>
      <Tooltip
        backgroundColor="transparent"
        isVisible={toolTipVisible}
        content={
          <Text style={style.tooltipTextStyle}>{toolTipContentText}</Text>
        }
        placement="top"
        onClose={() => setToolTipState(false)}>
        <TouchableOpacity
          disabled={verified}
          onPress={() => (!verified ? setToolTipState(true) : null)}
          style={verified ? style.verifiedButton : style.notVerifiedButton}>
          <Text
            style={[
              style.verifiedStatusTextStyle,
              {fontSize: hp(!verified ? '0.98%' : '1.47%')},
            ]}>
            {verified ? 'Verified' : 'Verification Needed'}
          </Text>
        </TouchableOpacity>
      </Tooltip>

      <TouchableOpacity
        onPress={() => deleteEmail(email)}
        style={style.iconContainer}>
        <AntIcon name="delete" size={hp('2.35%')} style={{color: '#FF0E0E'}} />
      </TouchableOpacity>
    </View>
  );
}

class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailList: [],
      addEmailActive: false,
      isLoading: false,
      newEmail: null,
      toolTipVisible: false,
      currentEmail: '',
      isAddEmail: false,
      isRemoveEmail: false,
    };
  }

  renderEmailList = emailList => {
    const token = this.props.loginReducer.initialData.token;
    const {toolTipVisible} = this.state;

    const setToolTipState = props => {
      this.setState({
        toolTipVisible: props,
      });
    };

    const deleteEmail = email => {
      const deleteTitle = 'Delete Email';
      const desc = 'Are you sure you want to remove ' + email;

      this.setState({
        currentEmail: email,
        isRemoveEmail: true,
        isAddEmail: false,
      });
      Alert.alert(deleteTitle, desc, [
        {text: 'Cancel', onPress: () => null},
        {
          text: 'Yes',
          onPress: () => {
            this.props.deletEmailFromList(token, email);
          },
        },
      ]);

      setTimeout(() => {
        this.props.getEmailList(token);
      }, 3000);
    };

    return (
      <FlatList
        data={emailList}
        key={emailList.email}
        keyExtractor={emailList.email}
        renderItem={item =>
          EmailListComponent(item, toolTipVisible, setToolTipState, deleteEmail)
        }
      />
    );
  };

  submitEmail = async () => {
    const emailCheckRegEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const {newEmail} = this.state;
    const token = this.props.loginReducer.initialData.token;
    if (!newEmail) {
      alert('Please enter email');
    } else if (!emailCheckRegEx.test(newEmail)) {
      alert('Please enter a valid e-mail');
    } else {
      this.setState({
        isLoading: true,
        isAddEmail: true,
        isRemoveEmail: false,
        currentEmail: newEmail,
      });

      const addEmailBody = {
        loginType: 'external',
        email: newEmail,
      };
      await this.props.addEmailToList(token, addEmailBody);

      setTimeout(() => {
        this.props.getEmailList(token);
      }, 3000);

      // setTimeout(()=>{
      //     this.setState({
      //         isLoading:false,
      //         addEmailActive:false
      //     },()=>{
      //         this.props.getEmailList(token)
      //         alert("E-mail added successfully")
      //     })
      // },3000)
    }
  };

  componentDidMount() {
    const loginReducer = this.props.loginReducer;
    const AccountReducer = this.props.AccountReducer;
    const {userDescription, token} = loginReducer;
    const {emailList} = AccountReducer;

    //call email list api
    this.props.getEmailList(token);

    this.setState({
      userDescription,
      token,
      emailList,
    });
  }

  componentWillUnmount() {
    this.setState({
      addEmailActive: false,
      isLoading: false,
      newEmail: null,
      toolTipVisible: false,
    });
  }

  componentDidUpdate(prevProps) {
    const {currentEmail, isAddEmail, isRemoveEmail} = this.state;
    const {emailList, error, errorMessage} = this.props.AccountReducer;
    const prevError = prevProps.AccountReducer.error;
    const prevEmailList = prevProps.AccountReducer.emailList;
    if (emailList.length) {
      if (!_.isEqual(emailList, prevEmailList)) {
        this.setState(
          {
            emailList,
            isLoading: false,
            addEmailActive: false,
            newEmail: '',
          },
          () => {
            if (currentEmail) {
              if (isAddEmail) {
                Alert.alert(
                  'Verification sent',
                  currentEmail + newEmailAddedAlertText,
                  [{text: 'OK', onPress: () => null}],
                );
                // const url =
                //   connectionURL.gkHubspotContacts +
                //   '/' +
                //   currentEmail +
                //   '/profile?hapikey=' +
                //   gkHubspotToken;

                // hitAPI.fetchHubspotContact(
                //   url,
                //   () => {
                //     this.props.logOut();
                //   },
                //   data => {
                //     if (data) {
                //       const hubspotProfile = data['list-memberships'];
                //       hubspotProfile.map(async item => {
                //         if (item['is-member']) {
                //           await this.props.setISPremium(true);
                //           try {
                //             await AsyncStorage.setItem('isPremium', '1');
                //           } catch (error) {
                //             console.log(error);
                //           }
                //         }
                //       });
                //     } else {
                //       console.log(data);
                //     }
                //   },
                // );
              }

              isRemoveEmail &&
                Alert.alert('Done', currentEmail + emailRemovedAlertText, [
                  {text: 'OK', onPress: () => null},
                ]);
            }
          },
        );
      }
    }
    if (error !== prevError) {
      if (error) {
        this.setState(
          {
            isLoading: false,
            addEmailActive: false,
            newEmail: '',
          },
          () => alert(errorMessage),
        );
      }
    }
  }

  render() {
    const {
      userAvatar,
      firstName,
      lastName,
      userDescription,
      addEmailActive,
      isLoading,
    } = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: primaryDarkColor}}>
        {/* custom header */}
        <CustomHeader
          // isQR={true}
          title="Account"
          navigation={this.props.navigation}
        />
        {/* custom header */}

        <View style={{flex: 1}}>
          {/* Profile Picture */}
          <View
            style={{zIndex: +1, alignItems: 'center', alignItems: 'center'}}>
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
              {this.props.loginReducer.userAvatar ? (
                <Image
                  source={{uri: this.props.loginReducer.userAvatar}}
                  style={{
                    height: hp('10.46%'),
                    width: hp('10.46%'),
                    borderRadius: hp('10.46%') / 2,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontSize: 40,
                    color: 'white',
                  }}>
                  {this.props.loginReducer.initialData.firstName[0] +
                    this.props.loginReducer.initialData.lastName[0]}
                </Text>
              )}
            </View>
          </View>
          {/* Profile Picture */}

          {/* White border radius wall */}
          <View style={style.whiteWallContainer}>
            {/* Name and description container */}
            <View style={style.nameAndDescriptionContainer}>
              {/* Name Field */}
              <Text style={style.nameTextFontStyle}>
                {this.props.loginReducer.initialData.firstName} {this.props.loginReducer.initialData.lastName}
              </Text>
              {/* Name Field */}

              {/* Description Field */}
              <Text style={style.descriptionTextFontStyle}>
                {this.props.loginReducer.userDescription}
              </Text>
              {/* Description Field */}

              {/* Divider */}
              <View style={style.divider}></View>
              {/* Divider */}
            </View>
            {/* Name and description container */}

            {/* Email Title  */}
            <View style={style.emailTitleContainer}>
              <Text style={style.emailTitleTextFont}>Email accounts</Text>
            </View>
            {/* Email Title  */}

            {/* Email List */}
            <View style={style.emailListStyle}>
              {this.renderEmailList(this.state.emailList)}
            </View>
            {/* Email List */}

            {/* Add new email textInput */}
            {addEmailActive ? (
              <View style={style.emailListComponentContainerStyle}>
                <TextInput
                  //   style={style.addEmailTextInputTextStyle}
                  placeholder="Add Email"
                  onChangeText={email => this.setState({newEmail: email})}
                  style={style.emailDisplayBoxContainer}
                />
                <TouchableOpacity
                  onPress={() => this.submitEmail()}
                  style={style.submitButton}>
                  {isLoading ? (
                    <ActivityIndicator
                      animating={isLoading}
                      size="small"
                      color={'white'}
                    />
                  ) : (
                    <Text style={style.submitTextStyle}>Submit</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({addEmailActive: false})}
                  style={style.iconContainer}>
                  <EntypoIcon name="cross" size={hp('2.35%')} />
                </TouchableOpacity>
              </View>
            ) : null}
            {/* Add new email textInput */}

            {/* Add Email Button */}
            <View style={style.addButtonStyleComponent}>
              <TouchableOpacity
                disabled={addEmailActive}
                onPress={() => this.setState({addEmailActive: true})}
                style={[
                  style.addEmailButtonStyle,
                  {backgroundColor: addEmailActive ? '#1212124D' : '#FBFBFB'},
                ]}>
                <Text style={style.addEmailTextStyle}>Add email</Text>
              </TouchableOpacity>
            </View>
            {/* Add Email Button */}
          </View>
          {/* White border radius wall */}
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

module.exports = connect(mapStateToProps, {
  getEmailList,
  addEmailToList,
  deletEmailFromList,
  setISPremium,
  logOut,
})(AccountScreen);

const style = {
  whiteWallContainer: {
    flex: 1,
    backgroundColor: '#FBFBFB',
    marginTop: hp('5.5%'),
    paddingTop: hp('2.4'),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  nameAndDescriptionContainer: {
    alignItems: 'center',
    marginTop: hp('5.54%'),
  },
  nameTextFontStyle: {
    fontSize: hp('2.216%'),
    fontFamily: mediumFont,
    color: '#000000',
  },
  descriptionTextFontStyle: {
    fontSize: hp('2.23%'),
    color: '#000000',
    fontFamily: regularFont,
    textAlign: 'center',
  },
  divider: {
    width: '60%',
    border: 1,
    borderColor: '#e0e0e0',
    borderWidth: 0.5,
    marginTop: hp('2.4%'),
  },
  emailTitleContainer: {
    marginTop: hp('2.4%'),
    marginLeft: hp('1%'),
  },
  emailTitleTextFont: {
    fontSize: hp('1.97%'),
    fontFamily: boldFont,
    color: '#000000',
  },
  emailListStyle: {
    maxHeight: '40%',
    minHeight: '10%',
    width: '100%',
    // flex:1
  },
  emailListComponentContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailDisplayBoxContainer: {
    width: wp('66.66%'),
    borderWidth: 1,
    borderColor: primaryColor,
    backgroundColor: primaryColor + '26',
    height: hp('5%'),
    justifyContent: 'center',
    padding: hp('1.23%'),
    margin: hp('1.23%'),
    borderRadius: hp('0.36%'),
  },
  emailDisplayTextStyle: {
    fontSize: hp('1.47%'),
    fontFamily: 'Montserrat-Light',
    color: '#000000',
  },
  verifiedButton: {
    width: wp('16.53%'),
    height: hp('3.32%'),
    borderRadius: hp('0.12%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#10813A',
  },
  notVerifiedButton: {
    width: wp('16.53%'),
    height: hp('3.32%'),
    borderRadius: hp('0.12%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6004',
  },
  submitButton: {
    width: wp('16.53%'),
    height: hp('4.31%'),
    borderRadius: hp('0.36%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
  },
  submitTextStyle: {
    fontSize: hp('1.47%'),
    color: '#FFFFFF',
    fontFamily: regularFont,
  },
  verifiedStatusTextStyle: {
    color: '#FFFFFF',
    fontSize: hp('1.477%'),
    fontFamily: lightFont,
    textAlign: 'center',
  },
  iconContainer: {
    height: hp('2.3%'),
    width: hp('2.3%'),
    margin: hp('1.23%'),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"blue"
  },
  addButtonStyleComponent: {
    marginLeft: hp('1.2%'),
    marginTop: hp('1.23%'),
  },
  addEmailButtonStyle: {
    height: hp('4.31%'),
    width: wp('28.53%'),
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: hp('0.36%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEmailTextStyle: {
    fontSize: hp('1.47%'),
    color: '#000000',
    fontFamily: regularFont,
  },
  addEmailTextInputTextStyle: {
    fontSize: hp('1.47%'),
    fontFamily: lightFont,
    color: '#000000',
  },
  tooltipTextStyle: {
    fontSize: hp('1.23%'),
    color: '#121212',
    fontFamily: lightFont,
  },
};
