import {Box, HStack, Image, Text, VStack} from 'native-base';
import React from 'react';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {coinImagePath, commonColors} from '../../../docs/config';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TransactionsListitemDate } from './TransactionsListItemDate';
// import {TransactionsListitemDate} from './TransactionsListitemDate';

export const TransactionsListItem = ({
  transactionReceiver,
  transactionSender,
  receiverBalance,
  senderbalance,
  receiverWalletAddress,
  senderWalletAddress,
  transactionValue,
  transactionOwnerWalletAddress,
  showDate,
  formattedDate,
}:any) => {
  const isTransactionOwner =
    senderWalletAddress === transactionOwnerWalletAddress;
  return (
    <Box>
      {showDate && <TransactionsListitemDate date={formattedDate} />}
      <Box borderColor="coolGray.200" borderWidth="1" p={'3'}>
        <HStack justifyContent={'space-between'}>
          <HStack>
            <VStack justifyContent={'center'} alignItems={'center'}>
              <Box
                w={hp('3%')}
                h={hp('3%')}
                rounded={'full'}
                bg={commonColors.primaryColor}
                justifyContent={'center'}
                alignItems={'center'}>
                <Text
                  fontSize={hp('1.46%')}
                  fontWeight={'bold'}
                  color={'white'}>
                  {transactionReceiver.slice(0, 2)}
                </Text>
              </Box>
            </VStack>
            <VStack ml={'2'}>
              <Box>
                <Text fontSize={hp('1.7%')} fontWeight={'bold'}>
                  {transactionReceiver}
                </Text>
              </Box>
              <Box>
                <Text fontSize={hp('1.6%')} fontWeight={'light'}>
                  Balance: {senderbalance}
                </Text>
              </Box>
            </VStack>
          </HStack>
          <HStack justifyContent={'center'} space={1} alignItems={'center'}>
            <Box>
              <Image
                alt="logo"
                height={hp('3%')}
                width={hp('3%')}
                source={coinImagePath}
              />
            </Box>
            <Box>
              <Text fontWeight={'bold'}>{transactionValue}</Text>
            </Box>
            <Box>
              <AntIcon
                name={isTransactionOwner ? 'arrowup' : 'arrowdown'}
                color={isTransactionOwner ? '#CB4141' : '#69CB41'}
                size={hp('1.7%')}
              />
            </Box>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};
