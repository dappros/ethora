/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Divider, Text, View } from 'native-base';
import React, {useState} from 'react';
import {
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
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonColors, textStyles } from '../../../docs/config';



const {primaryColor} = commonColors;
const {lightFont, semiBoldFont, boldFont} = textStyles;

const NftTransactionsHistoryComponent = props => {
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

  let senderFullName = '';
  let receiverFullName = '';
  senderFullName = props.item.senderFirstName + ' ' + props.item.senderLastName;
  receiverFullName =
    props.item.receiverFirstName + ' ' + props.item.receiverLastName;

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
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 20,
          marginHorizontal: 10,
        }}>
        <View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            {props.item.type !== 'Token Creation' && (
              <View
                style={{
                  width: hp('3%'),
                  height: hp('3%'),
                  // position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: primaryColor,
                  // left: -25,
                  // top: 5,
                  marginRight: 5,
                }}
                borderRadius={hp('3%') / 2}>
                <Text
                  style={{
                    fontSize: hp('1.46%'),
                    color: 'white',
                  }}>
                  {senderFullName[0]}
                </Text>
              </View>
            )}
            <View
              style={{
                marginLeft: wp('1.3%'),
                justifyContent: 'center',
                width: wp('27%'),
              }}>
              <Text style={{fontFamily: semiBoldFont, fontSize: hp('1.7%')}}>
                {props.item.type !== 'Token Creation'
                  ? senderFullName
                  : props.item.nftName}
              </Text>

              {props.item.type !== 'Token Creation' && (
                <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
                  Balance:{' '}
                  {props.item.senderBalance + '/' + props.item.nftTotal}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            justifySelf: 'center',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginRight: 'auto',
            marginLeft: 'auto',

            // width: wp('17%'),
          }}>
          {props.item.type !== 'Token Creation' ? (
            <AntIcon
              name={'arrowright'}
              color={'#69CB41'}
              size={hp('1.7%')}
              // style={{marginRight: 40}}
            />
          ) : (
            // <View style={{paddingRight: wp('10%')}}>
            <Text
              style={{
                fontSize: hp('1.5%'),
                textAlign: 'center',
                color: 'grey',
              }}>
              Was minted by
            </Text>

            // </View>
          )}
        </View>

        {/*    */}
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              // marginLeft: 20,
            }}>
            <View
              style={{
                width: hp('3%'),
                height: hp('3%'),
                // position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                // left: -25,
                // top: 5,
                marginRight: 10,
                backgroundColor: primaryColor,
              }}
              borderRadius={hp('3%') / 2}>
              <Text
                style={{
                  fontSize: hp('1.46%'),
                  color: 'white',
                }}>
                {receiverFullName[0]}
              </Text>
            </View>
            <View
              style={{
                marginRight: 'auto',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: wp('28%'),
              }}>
              <Text style={{fontFamily: semiBoldFont, fontSize: hp('1.7%')}}>
                {receiverFullName}
              </Text>

              <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
                Balance:{' '}
                {props.item.receiverBalance + '/' + props.item.nftTotal}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            // alignItems: 'flex-end',
            // alignSelf: 'center',
            // justifySelf: 'center',
            // position: 'absolute',
            width: wp('5%'),
            // marginLeft: 'auto',
            justifyContent: 'flex-end',
            // right: -0,
          }}>
          {/* {props.item.nftPreview && props.item.nftPreview !== 'null' ? (
            <Image
              source={{uri: props.item.nftPreview}}
              style={styles.imagePreviewStyle}
            />
          ) : (
            <Image
              source={require('../assets/coin.png')}
              style={styles.tokenIconStyle}
            />
          )} */}

          <Text
            style={{
              fontFamily: semiBoldFont,
              fontSize: hp('1.7%'),
              // margin: 5,
              textAlign: 'right',
              // justifySelf: 'center',
              alignSelf: 'center',
            }}>
            {props.item.value}
          </Text>
          {/* <AntIcon
            name={
              props.item.from === props.walletAddress ? 'arrowup' : 'arrowdown'
            }
            color={
              props.item.from === props.walletAddress ? '#CB4141' : '#69CB41'
            }
            size={hp('1.7%')}
            style={{margin: 5}}
          /> */}
          {/* {props.item.from === props.item.to && (
            <AntIcon
              name="arrowdown"
              color="#69CB41"
              size={hp('1.7%')}
              style={{margin: 5}}
            />
          )} */}
        </View>
      </View>
      <Divider />
    </View>
  );
};

const TransactionList = (params, tabIndex) => {
  let {transactions, walletAddress} = params;
  let currentHeaderDate:any = null;
  //   console.log(transactions, 'mytraaa');
  if (transactions.length > 0) {
    if (tabIndex === 0) {
      return (
        <View style={{backgroundColor: 'white'}}>
          <ScrollView nestedScrollEnabled={true}>
            {transactions
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  (new Date(a.timestamp).getTime()),
              )
              .map(item => {
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

                return NftTransactionsHistoryComponent({
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
  }
};

const NftTransactionListTab = params => {
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
        {/* <TouchableOpacity
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
        </TouchableOpacity> */}
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

export default NftTransactionListTab;
