import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Divider} from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';
// const TransactionListTab = ({
//     params,
// }) => {
//     return
//     (<View>
//         <Text>componentName</Text>
//     </View>)
// };

import {commonColors, textStyles, coinImagePath} from '../../docs/config';


const {primaryColor} = commonColors;
const {lightFont, semiBoldFont, boldFont} = textStyles;

const TransactionListComponent = props => {
  const month = new Array();
  month[0] = 'Jan';
  month[1] = 'Feb';
  month[2] = 'March';
  month[3] = 'April';
  month[4] = 'May';
  month[5] = 'June';
  month[6] = 'July';
  month[7] = 'Aug';
  month[8] = 'Sept';
  month[9] = 'Oct';
  month[10] = 'Nov';
  month[11] = 'Dec';
  const today = new Date();
  let Header = null;

  let fullName = '';
  let firstName = '';
  let lastName = '';
  // console.log(props.item)
  
  if (props.item.from === props.walletAddress) {
    firstName = props.item.toFirstName
      ? props.item.toFirstName === 'N/A'
        ? 'Anonymous'
        : props.item.toFirstName
      : 'Anonymous';
    lastName = props.item.toLastName
      ? props.item.toLastName === 'N/A'
        ? ''
        : props.item.toLastName
      : '';
    fullName = firstName + ' ' + lastName;
  } else {
    firstName = props.item.fromFirstName
      ? props.item.fromFirstName === 'N/A'
        ? 'Anonymous'
        : props.item.fromFirstName
      : 'Anonymous';
    lastName = props.item.fromLastName
      ? props.item.fromLastName === 'N/A'
        ? ''
        : props.item.fromLastName
      : '';
    fullName = firstName + ' ' + lastName;
  }

  if(props.item.nftFileUrl) {
    // console.log(item, 'dsfsldfu')
  }

  if (props.showHeader) {
    if (props.currentHeaderDate.getTime() === today.getTime()) {
      Header = (
        <View
          style={{
            backgroundColor: '#7E7E7E',
            height: hp('3%'),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: lightFont,
              textAlign: 'center',
              color: 'white',
            }}>
            Today
          </Text>
        </View>
      );
    } else {
      Header = (
        <View
          style={{
            backgroundColor: '#7E7E7E',
            height: hp('3%'),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: lightFont,
              textAlign: 'center',
              color: 'white',
            }}>
            {props.currentHeaderDate.getDate()}{' '}
            {month[props.currentHeaderDate.getMonth()]}{' '}
            {props.currentHeaderDate.getFullYear()}
          </Text>
        </View>
      );
    }
  }
  return (
    <View
      key={props.item.transactionHash}
      style={{flex: 1, paddingBottom: Platform.OS === 'android' ? 5 : null}}>
      {Header}
      <View style={{flexDirection: 'row', margin: 20,}}>
        <View style={{flex: 0.1}}>
          <View
            style={{
              width: hp('3%'),
              height: hp('3%'),
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: primaryColor,
            }}
            borderRadius={hp('3%') / 2}>
            <Text
              style={{
                fontSize: hp('1.46%'),
                color: 'white',
              }}>
              {firstName === 'Anonymous' ? 'A' : firstName[0] + lastName[0]}
            </Text>
          </View>
        </View>
        <View style={{flex: 0.7, marginLeft: wp('1.3%')}}>
          <Text style={{fontFamily: semiBoldFont, fontSize: hp('1.7%')}}>
            {fullName}
          </Text>
          <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
            Balance: {props.item.balance && props.item.balance.length < 10 ? props.item.balance : 'nan'}
          </Text>
        </View>
        <View style={{flex: 0.2, flexDirection: 'row', alignItems: 'center'}}>
          {props.item.nftPreview !== 'null' ? (
            <Image
              source={{uri: props.item.nftPreview}}
              style={styles.imagePreviewStyle}
            />
          ) : (
            <Image
              source={coinImagePath}
              style={styles.tokenIconStyle}
            />
          )}

          <Text
            style={{fontFamily: semiBoldFont, fontSize: hp('1.7%'), margin: 5}}>
            {props.item.value}
          </Text>
          <AntIcon
            name={
              props.item.from === props.walletAddress ? 'arrowup' : 'arrowdown'
            }
            color={
              props.item.from === props.walletAddress ? '#CB4141' : '#69CB41'
            }
            size={hp('1.7%')}
            style={{margin: 5}}
          />
          {props.item.from === props.item.to && (
            <AntIcon
              name="arrowdown"
              color="#69CB41"
              size={hp('1.7%')}
              style={{margin: 5}}
            />
          )}
        </View>
      </View>
      <Divider />
    </View>
  );
};

const TransactionList = (params, tabIndex) => {
  let {transactions, walletAddress} = params;
  let currentHeaderDate = null;
  console.log(transactions, 'mytraaa');
  if (transactions.length > 0) {
    if (tabIndex === 0) {
      return (
        <View style={{backgroundColor: 'white'}}>
          <ScrollView nestedScrollEnabled={true}>
            {transactions.map(item => { 
                // console.log(item, 'traaasss')
// if (item.tokenId === 'NFT') return

              let showHeader = false;
              const transactionTimeStamp =
                item?.timestamp instanceof Date
                  ? item.timestamp
                  : new Date(item.timestamp);
              if (currentHeaderDate === null) {
                currentHeaderDate = transactionTimeStamp;
                showHeader = true;
              }
              if (
                currentHeaderDate.getDate() +
                  currentHeaderDate.getMonth() +
                  currentHeaderDate.getFullYear() !==
                transactionTimeStamp.getDate() +
                  transactionTimeStamp.getMonth() +
                  transactionTimeStamp.getFullYear()
              ) {
                currentHeaderDate = transactionTimeStamp;
                showHeader = true;
              }

              return TransactionListComponent({
                showHeader,
                currentHeaderDate,
                item,
                walletAddress,
              });
            })}
          </ScrollView>
        </View>
      );
    }

    if (tabIndex === 1) {
      console.log(transactions,"sentsdfs")
      return (
        <View style={{backgroundColor: 'white'}}>
          <ScrollView nestedScrollEnabled={true} style={{height: '100%'}}>
            {transactions.map(item => {
              let showHeader = false;
              const transactionTimeStamp =
                item?.timestamp instanceof Date
                  ? item.timestamp
                  : new Date(item.timestamp);
              if (currentHeaderDate === null) {
                currentHeaderDate = transactionTimeStamp;
                showHeader = true;
              }
              if (
                currentHeaderDate.getDate() +
                  currentHeaderDate.getMonth() +
                  currentHeaderDate.getFullYear() !==
                transactionTimeStamp.getDate() +
                  transactionTimeStamp.getMonth() +
                  transactionTimeStamp.getFullYear()
              ) {
                currentHeaderDate = transactionTimeStamp;
                showHeader = true;
              }

              return (
                item.from === walletAddress &&
                TransactionListComponent({
                  showHeader,
                  currentHeaderDate,
                  item,
                  walletAddress,
                })
              );
            })}
          </ScrollView>
        </View>
      );
    }

    if (tabIndex === 2) {
      return (
        <View style={{backgroundColor: 'white'}}>
          <ScrollView nestedScrollEnabled={true}>
            {transactions.map(item => {
              let showHeader = false;
              const transactionTimeStamp =
                item?.timestamp instanceof Date
                  ? item.timestamp
                  : new Date(item.timestamp);
              if (currentHeaderDate === null) {
                currentHeaderDate = transactionTimeStamp;
                showHeader = true;
              }
              if (
                currentHeaderDate.getDate() +
                  currentHeaderDate.getMonth() +
                  currentHeaderDate.getFullYear() !==
                transactionTimeStamp.getDate() +
                  transactionTimeStamp.getMonth() +
                  transactionTimeStamp.getFullYear()
              ) {
                currentHeaderDate = transactionTimeStamp;
                showHeader = true;
              }

              return (
                item.to === walletAddress &&
                TransactionListComponent({
                  showHeader,
                  currentHeaderDate,
                  item,
                  walletAddress,
                })
              );
            })}
          </ScrollView>
        </View>
      );
    }
  } else {
    return (
      <View
        style={{
          alignItems: 'center',
          textAlign: 'center',
          padding: wp('5%'),
          height: '100%',
          width: '100%',
        }}>
        <Image
          source={require('../assets/transactions-empty.png')}
          style={{
            resizeMode: 'stretch',
            height: hp('21.50%'),
            width: wp('47.69%'),
          }}
        />
        <Text
          style={{
            fontFamily: semiBoldFont,
            fontSize: hp('2.21%'),
            color: primaryColor,
            marginTop: hp('1.7%'),
          }}>
          You have no transactions
        </Text>
        <Text
          style={{
            fontFamily: lightFont,
            fontSize: hp('1.72%'),
            textAlign: 'center',
            marginTop: hp('1.7%'),
          }}>
          Long press any chat message of your choice and make your first
          transaction.
        </Text>
      </View>
    );
  }
};

const TransactionListTab = params => {
  const [tabIndex, settabIndex] = useState(0);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          borderWidth: 0.5,
          borderColor: '#00000029',
        }}>
        <TouchableOpacity
          onPress={() => settabIndex(0)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: hp('8.12%'),
            backgroundColor: tabIndex === 0 ? '#F3F3F3' : '#FFFFFF',
            shadowColor: tabIndex === 0 ? '#00000029' : null,
            shadowOffset:
              tabIndex === 0 ? {width: 0, height: hp('0.36')} : null,
            shadowOpacity: tabIndex === 0 ? 0.12 : null,
            shadowRadius: tabIndex === 0 ? 60 : null,
          }}>
          <Text
            style={{
              color: primaryColor,
              fontSize: hp('2.216%'),
              fontFamily: boldFont,
            }}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(1)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: hp('8.12%'),
            backgroundColor: tabIndex === 1 ? '#F3F3F3' : '#FFFFFF',
            shadowColor: tabIndex === 1 ? '#00000029' : null,
            shadowOffset:
              tabIndex === 1 ? {width: 0, height: hp('0.36')} : null,
            shadowOpacity: tabIndex === 1 ? 0.12 : null,
            shadowRadius: tabIndex === 1 ? 60 : null,
          }}>
          <Text
            style={{
              color: primaryColor,
              fontSize: hp('2.216%'),
              fontFamily: boldFont,
            }}>
            Sent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(2)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: hp('8.12%'),
            backgroundColor: tabIndex === 2 ? '#F3F3F3' : '#FFFFFF',
            shadowColor: tabIndex === 2 ? '#00000029' : null,
            shadowOffset:
              tabIndex === 2 ? {width: 0, height: hp('0.36')} : null,
            shadowOpacity: tabIndex === 2 ? 0.12 : null,
            shadowRadius: tabIndex === 2 ? 60 : null,
          }}>
          <Text
            style={{
              color: primaryColor,
              fontSize: hp('2.216%'),
              fontFamily: boldFont,
            }}>
            Received
          </Text>
        </TouchableOpacity>
      </View>
      {TransactionList(params, tabIndex)}
    </View>
  );
};
const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
  imagePreviewStyle: {
    height: hp('5%'),
    width: hp('7%'),
  },
});

export default TransactionListTab;
