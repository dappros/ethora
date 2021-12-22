/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

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
import moment from 'moment';

const {primaryColor} = commonColors;
const {lightFont, semiBoldFont, boldFont} = textStyles;

export const TransactionListItem = ({
  item,
  walletAddress,
  showHeader,
  currentHeaderDate,
}) => {
  const [expanded, setExpanded] = useState(false);
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
  // console.log(item)

  if (item.from === walletAddress) {
    firstName = item.toFirstName
      ? item.toFirstName === 'N/A'
        ? 'Anonymous'
        : item.toFirstName
      : 'Anonymous';
    lastName = item.toLastName
      ? item.toLastName === 'N/A'
        ? ''
        : item.toLastName
      : '';
    fullName = firstName + ' ' + lastName;
  } else {
    firstName = item.fromFirstName
      ? item.fromFirstName === 'N/A'
        ? 'Anonymous'
        : item.fromFirstName
      : 'Anonymous';
    lastName = item.fromLastName
      ? item.fromLastName === 'N/A'
        ? ''
        : item.fromLastName
      : '';
    fullName = firstName + ' ' + lastName;
  }

  if (showHeader) {
    if (currentHeaderDate.getTime() === today.getTime()) {
      Header = (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Today</Text>
        </View>
      );
    } else {
      Header = (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            {currentHeaderDate.getDate()} {month[currentHeaderDate.getMonth()]}{' '}
            {currentHeaderDate.getFullYear()}
          </Text>
        </View>
      );
    }
  }
  return (
    <View
      key={item.transactionHash}
      style={{
        flex: 1,
        paddingBottom: Platform.OS === 'android' ? 5 : null,
      }}>
      {Header}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(prev => !prev)}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              margin: 20,
            }}>
            <View style={{flex: 0.1}}>
              <View style={styles.itemName} borderRadius={hp('3%') / 2}>
                <Text style={styles.itemNameText}>
                  {firstName === 'Anonymous' ? 'A' : firstName[0] + lastName[0]}
                </Text>
              </View>
            </View>
            <View style={{flex: 0.7, marginLeft: wp('1.3%')}}>
              <Text style={{fontFamily: semiBoldFont, fontSize: hp('1.7%')}}>
                {fullName}
              </Text>
              <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
                Balance:{' '}
                {item.balance && item.balance.length < 10
                  ? item.balance
                  : 'nan'}
              </Text>
            </View>
            <View
              style={[
                styles.rowEnd,
                {
                  flex: item.nftPreview !== 'null' ? 0.3 : 0.2,
                },
              ]}>
              {item.nftPreview && item.nftPreview !== 'null' ? (
                <Image
                  source={{uri: item.nftPreview}}
                  style={styles.imagePreviewStyle}
                />
              ) : (
                <Image source={coinImagePath} style={styles.tokenIconStyle} />
              )}

              <Text
                style={{
                  fontFamily: semiBoldFont,
                  fontSize: hp('1.7%'),
                  margin: 5,
                }}>
                {item.value}
              </Text>
              <AntIcon
                name={item.from === walletAddress ? 'arrowup' : 'arrowdown'}
                color={item.from === walletAddress ? '#CB4141' : '#69CB41'}
                size={hp('1.7%')}
              />
              {/* {item.from === item.to && (
              <AntIcon
                name="arrowdown"
                color="#69CB41"
                size={hp('1.7%')}
              />
            )} */}
            </View>
          </View>
          {expanded && (
            <View style={{paddingHorizontal: 20}}>
              {/* <Text style={styles.detailsItemTextBold}>Details:</Text> */}
              <View style={styles.detailsItem}>
                <Text style={styles.detailsItemTextBold}>TX hash: </Text>
                <Text style={{textAlign: 'left', fontWeight: '300'}}>
                  {item.transactionHash}
                </Text>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsItemTextBold}>From:</Text>
                <View>
                  <Text style={{textAlign: 'left'}}>{item.from}</Text>
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsItemTextBold}>To:</Text>
                <View>
                  <Text style={{textAlign: 'left'}}>{item.to}</Text>
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsItemTextBold}>Timestamp:</Text>
                <View>
                  <Text style={{textAlign: 'left'}}>
                    {moment(item.timestamp).unix()}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsItemTextBold}>Value:</Text>
                <View>
                  <Text style={{textAlign: 'left'}}>{item.value}</Text>
                </View>
              </View>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsItemTextBold}>Block:</Text>
                <View>
                  <Text style={{textAlign: 'left'}}>
                    {String(item.blockNumber).replace(
                      /(.)(?=(\d{3})+$)/g,
                      '$1,',
                    )}
                  </Text>
                </View>
              </View>

              {/* <Text>To: {JSON.stringify(item)}</Text> */}
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Divider />
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
  headerContainer: {
    backgroundColor: '#7E7E7E',
    height: hp('3%'),
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: lightFont,
    textAlign: 'center',
    color: 'white',
  },
  itemName: {
    width: hp('3%'),
    height: hp('3%'),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
  },
  itemNameText: {
    fontSize: hp('1.46%'),
    color: 'white',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderWidth: 0.5,
    borderColor: '#00000029',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: hp('8.12%'),
  },
  tabItemText: {
    color: primaryColor,
    fontSize: hp('2.216%'),
    fontFamily: boldFont,
  },
  detailsItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
    paddingRight: wp('20%'),
    maxWidth: '100%',
  },
  detailsItemTextBold: {
    width: wp('23%'),
    fontWeight: '700',
  },
});
