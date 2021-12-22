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
import {TransactionListItem} from './TransactionListItem';

const {primaryColor} = commonColors;
const {lightFont, semiBoldFont, boldFont} = textStyles;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const TransactionList = (params, tabIndex, onEndReached) => {
  let {transactions, walletAddress} = params;
  let currentHeaderDate = null;
  if (transactions.length > 0) {
    if (tabIndex === 0) {
      return (
        <View style={{backgroundColor: 'white'}}>
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                onEndReached();
              }
            }}
            nestedScrollEnabled={true}>
            {transactions.map(item => {
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

              return (
                <TransactionListItem
                  showHeader={showHeader}
                  currentHeaderDate={currentHeaderDate}
                  item={item}
                  walletAddress={walletAddress}
                />
              );
            })}
          </ScrollView>
        </View>
      );
    }

    if (tabIndex === 1) {
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
                item.from === walletAddress && (
                  <TransactionListItem
                    showHeader={showHeader}
                    currentHeaderDate={currentHeaderDate}
                    item={item}
                    walletAddress={walletAddress}
                  />
                )
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
                item.to === walletAddress && (
                  <TransactionListItem
                    showHeader={showHeader}
                    currentHeaderDate={currentHeaderDate}
                    item={item}
                    walletAddress={walletAddress}
                  />
                )
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
  const tabStyle = {
    shadowColor: tabIndex === 1 ? '#00000029' : null,
    shadowOffset: tabIndex === 1 ? {width: 0, height: hp('0.36')} : null,
    shadowOpacity: tabIndex === 1 ? 0.12 : null,
    shadowRadius: tabIndex === 1 ? 60 : null,
  };
  return (
    <View>
      <View style={styles.tabItemContainer}>
        <TouchableOpacity
          onPress={() => settabIndex(0)}
          style={[
            styles.tabItem,
            tabStyle,
            {backgroundColor: tabIndex === 0 ? '#F3F3F3' : '#FFFFFF'},
          ]}>
          <Text style={styles.tabItemText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(1)}
          style={[
            styles.tabItem,
            tabStyle,
            {backgroundColor: tabIndex === 1 ? '#F3F3F3' : '#FFFFFF'},
          ]}>
          <Text style={styles.tabItemText}>Sent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => settabIndex(2)}
          style={[
            styles.tabItem,
            tabStyle,
            {backgroundColor: tabIndex === 2 ? '#F3F3F3' : '#FFFFFF'},
          ]}>
          <Text style={styles.tabItemText}>Received</Text>
        </TouchableOpacity>
      </View>
      {TransactionList(params, tabIndex, params.onEndReached)}
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

export default TransactionListTab;
