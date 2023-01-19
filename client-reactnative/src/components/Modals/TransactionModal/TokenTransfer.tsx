/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, {Fragment} from 'react';
// import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import {coinImagePath, textStyles} from '../../../../docs/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {HStack, Image, Pressable, Text, View} from 'native-base';

interface TokenTransferProps {
  name: string;
  tokenTransferFunc: (amount: number) => void;
  onCustomAmountPress: () => void;
  tokenAmount: number;
}

interface CoinComponentProps {
  tokenTransferFunc: any;
  tokenAmount: number;
  amt: number;
}

const CoinComponent = (props: CoinComponentProps) => {
  return (
    <Pressable
      accessibilityLabel="Tap to send coins"
      onPress={() => props.tokenTransferFunc(props.amt)}
      justifyContent="center"
      alignItems={'center'}
      borderWidth={props.tokenAmount === props.amt ? props.amt : null}
      borderColor={props.tokenAmount === props.amt ? '#A1A9B4' : null}>
      <Image
        alt="Coin Image"
        source={coinImagePath}
        h={hp('3%')}
        w={hp('3%')}
      />
      <Text fontFamily={textStyles.boldFont}>{props.amt}</Text>
    </Pressable>
  );
};

const TokenTransfer = ({
  name,
  tokenAmount,
  tokenTransferFunc,
  onCustomAmountPress,
}: TokenTransferProps) => {
  const coinsList = [1, 3, 5];
  return (
    <Fragment>
      <Text
        fontFamily={textStyles.regularFont}
        fontSize={hp('1.5%')}
        margin={5}
        textAlign={'center'}>
        Reward{' '}
        <Text fontFamily={textStyles.boldFont} fontSize={hp('1.5%')}>
          {name}
        </Text>{' '}
        with coins
      </Text>
      <HStack w={'100%'} justifyContent={'space-evenly'}>
        {coinsList.map(item => {
          return (
            <CoinComponent
              key={item}
              amt={item}
              tokenAmount={tokenAmount}
              tokenTransferFunc={tokenTransferFunc}
            />
          );
        })}
        <CoinComponent
          amt={'X'}
          tokenAmount={tokenAmount}
          tokenTransferFunc={onCustomAmountPress}
        />
      </HStack>

      {/* <View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}>
        <TouchableOpacity onPress={()=>props.closeModal()} style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>props.tokenTransferFunc()} style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
          <Text>OK</Text>
        </TouchableOpacity>
      </View> */}
    </Fragment>
  );
};

export default TokenTransfer;
