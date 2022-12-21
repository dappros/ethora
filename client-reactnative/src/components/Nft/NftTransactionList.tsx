/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {Divider, Text, View} from 'native-base';
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
import {commonColors, textStyles} from '../../../docs/config';
import {observer} from 'mobx-react-lite';

// import {FlatList} from 'react-native-gesture-handler';

import {NftTransactionItem} from '../Transactions/NftTransactionItem';
import {compareTransactionsDate} from '../../helpers/transactions/compareTransactionsDate';
import {Box, FlatList} from 'native-base';

const {primaryColor} = commonColors;
const {lightFont, semiBoldFont, boldFont} = textStyles;

const NftTransactionsHistoryComponent = props => {
  const [expanded, setExpanded] = useState(false);
  const {item} = props;
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
  const nftTotal =
    props.item.contractId && props.item.nftTotal
      ? props.item.nftTotal
          .split(',')
          .find((item, i) => +props.item.contractId === i + 1)
      : props.item.nftTotal;

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
  const getOtherBalance = () => {
    let firstPart = '';
    let secondPart = '';
    if (props.item.type === 'Transfer Ownership') {
      return;
    }
    if (props.historyItem?.nfmtType && props.item.type === 'Token Creation') {
      firstPart = 'Max Supply';
    } else {
      firstPart = 'Balance';
    }
    if (props.historyItem?.nfmtType && props.item.type === 'Token Creation') {
      secondPart = props.item.nftTotal;
    } else if (props.item.type === 'Token Creation') {
      secondPart = nftTotal;
    } else {
      props.item.receiverBalance;
    }
    return firstPart + ':' + secondPart + '/' + nftTotal;
  };
  return (
    <View
      key={props.item.transactionHash}
      style={{flex: 1, paddingBottom: Platform.OS === 'android' ? 5 : null}}>
      {Header}
      <TouchableOpacity
        onPress={() => setExpanded(prev => !prev)}
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

              {props.item.type !== 'Token Creation' &&
                props.item.type !== 'Transfer Ownership' && (
                  <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
                    Balance: {props.item.senderBalance + '/' + nftTotal}
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
              color={
                props.item.type !== 'Transfer Ownership' ? '#69CB41' : 'red'
              }
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
              Was created by
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

              {props.item.type !== 'Transfer Ownership' && (
                <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
                  {props.historyItem?.nfmtType &&
                  props.item.type === 'Token Creation'
                    ? 'Max Supply'
                    : 'Balance'}
                  :{' '}
                  {props.historyItem?.nfmtType &&
                  props.item.type === 'Token Creation'
                    ? props.item.nftTotal
                    : (props.item.type === 'Token Creation'
                        ? nftTotal
                        : props.item.receiverBalance) +
                      '/' +
                      nftTotal}
                </Text>
              )}
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
            {props.item.value !== 0 && props.item.value}
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
      </TouchableOpacity>
      {expanded && (
        <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
          {/* <Text style={styles.detailsItemTextBold}>Details:</Text> */}
          <View style={styles.detailsItem}>
            <Text style={styles.detailsItemTextBold}>TX hash: </Text>
            <Text style={{textAlign: 'left', color: 'black'}}>
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
                {new Date(item.timestamp).getTime()}
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
                {String(item.blockNumber).replace(/(.)(?=(\d{3})+$)/g, '$1,')}
              </Text>
            </View>
          </View>

          {/* <Text>To: {JSON.stringify(item)}</Text> */}
        </View>
      )}
      <Divider />
    </View>
  );
};

// const TransactionList = (params, tabIndex) => {
//   let {transactions, walletAddress, historyItem} = params;
//   let currentHeaderDate: any = null;
//   //   console.log(transactions, 'mytraaa');
//   if (transactions.length > 0) {
//     if (tabIndex === 0) {
//       return (
//         <View style={{backgroundColor: 'white'}}>
//           <ScrollView nestedScrollEnabled={true}>
//             {transactions
//               .sort(
//                 (a, b) =>
//                   new Date(b.timestamp).getTime() -
//                   new Date(a.timestamp).getTime(),
//               )
//               .map(item => {
//                 // console.log(item, 'traaasss')
//                 // if (item.tokenId === 'NFT') return

//                 let showHeader = false;
//                 const transactionTimeStamp =
//                   item?.timestamp instanceof Date
//                     ? item.timestamp
//                     : new Date(item.timestamp);
//                 if (currentHeaderDate === null) {
//                   currentHeaderDate = transactionTimeStamp;
//                   showHeader = true;
//                 }
//                 if (
//                   currentHeaderDate.getDate() +
//                     currentHeaderDate.getMonth() +
//                     currentHeaderDate.getFullYear() !==
//                   transactionTimeStamp.getDate() +
//                     transactionTimeStamp.getMonth() +
//                     transactionTimeStamp.getFullYear()
//                 ) {
//                   currentHeaderDate = transactionTimeStamp;
//                   showHeader = true;
//                 }

//                 return NftTransactionsHistoryComponent({
//                   showHeader,
//                   currentHeaderDate,
//                   item,
//                   walletAddress,
//                   historyItem,
//                 });
//               })}
//           </ScrollView>
//         </View>
//       );
//     }
//   }
// };

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
        }}></View>
      {TransactionList(params, tabIndex)}
    </View>
  );
};

const RenderTransactionItem = ({
  transaction,
  transactionOwnerWalletAddress,
}: any) => {
  const {
    from,
    to,
    tokenName,
    value,
    type,
    timestamp,
    senderFirstName,
    senderLastName,
    receiverFirstName,
    receiverLastName,
    senderBalance,
    receiverBalance,
    createdAt,
    updatedAt,
    blockNumber,
    transactionHash,
    fromFirstName,
    fromLastName,
    toFirstName,
    toLastName,
    showDate,
    formattedDate,
    balance,
    nftName,
    nftTotal,
    contractId,
  } = transaction;
  console.log(transaction)
  return (
    <NftTransactionItem
      // historyItemTotal={}
      from={from}
      to={to}
      balance={balance}
      senderBalance={senderBalance}
      receiverBalance={receiverBalance}
      transactionAmount={value}
      transactionSender={senderFirstName + ' ' + senderLastName}
      transactionReceiver={receiverFirstName + ' ' + receiverLastName}
      blockNumber={blockNumber}
      transactionHash={transactionHash}
      timestamp={timestamp}
      showDate={showDate}
      formattedDate={formattedDate}
      senderName={senderFirstName + ' ' + senderLastName}
      receiverName={receiverFirstName + ' ' + receiverLastName}
      tokenName={nftName}
      transactionOwnerWalletAddress={transactionOwnerWalletAddress}
      type={type}
      nftTotal={nftTotal}
      value={value}
      contractId={contractId}
    />
  );
};

interface TransactionListProps {
  transactions: any;
  walletAddress: string;
  onEndReached: any;
}

const TransactionsList = observer(
  ({transactions, walletAddress, onEndReached}: TransactionListProps) => {
    return (
      <Box>
        <FlatList
          height={'100%'}
          scrollEnabled
          style={{paddingBottom: 50}}
          renderItem={transaction => (
            <RenderTransactionItem
              transaction={transaction.item}
              transactionOwnerWalletAddress={walletAddress}
            />
          )}
          onEndReached={onEndReached}
          data={compareTransactionsDate(transactions)}
          keyExtractor={transaction => transaction.transactionHash}
        />
      </Box>
    );
  },
);
const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
  imagePreviewStyle: {
    height: hp('5%'),
    width: hp('7%'),
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

export default TransactionsList;
