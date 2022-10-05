/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import {Box, HStack, Image, Text, VStack} from 'native-base';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {coinImagePath, commonColors, textStyles} from '../../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {TransactionsListitemDate} from './TransactionsListItemDate';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

interface TransactionListProps {
  showDate: string;
  formattedDate: string;
  blockNumber: string;
  senderName: string;
  receiverName: string;

  balance: number;
  transactionAmount: number;
  senderBalance: number;
  receiverBalance: number;

  image: string;
  timestamp: string;
  transactionHash: string;
  transactionSender: string;
  transactionReceiver: string;
  transactionOwnerWalletAddress: string;
  from: string;
  to: string;
  type: string;
  nftTotal: number;
  tokenName: string;
}

const UserBlock = ({name, balance, total}) => {
  return (
    <HStack w={'40%'}>
      <VStack justifyContent={'center'} alignItems={'center'}>
        <Box
          w={hp('2.89%')}
          h={hp('2.89%')}
          rounded={'full'}
          bg={commonColors.primaryColor}
          justifyContent={'center'}
          alignItems={'center'}>
          <Text fontSize={hp('1.46%')} fontWeight={'bold'} color={'white'}>
            {name.slice(0, 2)}
          </Text>
        </Box>
      </VStack>
      <VStack ml={'2'}>
        <Box>
          <Text fontSize={hp('1.7%')} fontWeight={'bold'}>
            {name}
          </Text>
        </Box>
        <Box>
          <Text fontSize={hp('1.6%')} fontWeight={'light'}>
            Balance: 
          </Text>
          <Text fontSize={hp('1.6%')} fontWeight={'light'}>
          {balance}/{total}
          </Text>
        </Box>
      </VStack>
    </HStack>
  );
};

export const NftTransactionItem = (props: TransactionListProps) => {
  const {
    transactionReceiver,
    transactionSender,
    transactionAmount,
    showDate,
    formattedDate,

    senderName,
    receiverName,

    type,
    tokenName,
    senderBalance,
    receiverBalance,
    nftTotal,
  } = props;
  const [expanded, setExpanded] = useState(false);
і
  return (
    <Box>
      {showDate && <TransactionsListitemDate date={formattedDate} />}
      <Box borderColor="coolGray.200" borderWidth="1" p={'3'}>
        <HStack justifyContent={'space-between'}>
          <HStack justifyContent={'center'} space={1} alignItems={'center'}>
            {type === 'Token Creation' ? (
              <HStack w={'40%'}>
                <Text>{tokenName}</Text>
                <Text    style={{marginRight: 'auto'}}>{'Was minted by'}</Text>
              </HStack>
            ) : (
              <>
                <UserBlock
                  name={senderName}
                  balance={senderBalance}
                  total={nftTotal}
                />
                <AntIcon
                  name={'arrowright'}
                  color={'#69CB41'}
                  size={hp('1.7%')}
                  style={{marginRight: 'auto'}}
                />
              </>
            )}
            <UserBlock
              name={receiverName}
              balance={receiverBalance}
              total={nftTotal}
            />

            <Box>
              <Text fontWeight={'bold'}>{transactionAmount}</Text>
            </Box>
          </HStack>
        </HStack>
      </Box>
    </Box>
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
    fontFamily: textStyles.lightFont,
    textAlign: 'center',
    color: 'white',
  },
  itemName: {
    width: hp('4%'),
    height: hp('4%'),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.primaryColor,
    marginTop: 2,
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
    color: commonColors.primaryColor,
    fontSize: hp('2.216%'),
    fontFamily: textStyles.boldFont,
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
