/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { Fragment } from "react"
// import { Text, View, StyleSheet, Pressable, Image } from 'react-native';
import { coinImagePath, textStyles } from "../../../../docs/config"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { HStack, Image, Pressable, Text } from "native-base"

const coinsList = [1, 3, 5]

interface CoinsTransferProps {
  name: string
  onTokenTransferPress: (amount: number) => void
  onCustomAmountPress: () => void
}

interface CoinComponentProps {
  onPress: () => void
  tokenAmount: number | string
}

const CoinComponent: React.FC<CoinComponentProps> = ({
  tokenAmount,
  onPress,
}) => {
  return (
    <Pressable
      accessibilityLabel="Tap to send coins"
      onPress={onPress}
      justifyContent="center"
      alignItems={"center"}
    >
      <Image
        alt="Coin Image"
        source={coinImagePath}
        h={hp("3%")}
        w={hp("3%")}
      />
      <Text fontFamily={textStyles.boldFont}>{tokenAmount}</Text>
    </Pressable>
  )
}

export const CoinsTransferList = ({
  name,
  onTokenTransferPress,
  onCustomAmountPress,
}: CoinsTransferProps) => {
  return (
    <Fragment>
      <Text
        fontFamily={textStyles.regularFont}
        fontSize={hp("1.5%")}
        margin={5}
        textAlign={"center"}
      >
        Reward{" "}
        <Text fontFamily={textStyles.boldFont} fontSize={hp("1.5%")}>
          {name}
        </Text>{" "}
        with coins
      </Text>
      <HStack w={"100%"} justifyContent={"space-evenly"}>
        {coinsList.map((item) => {
          return (
            <CoinComponent
              key={item}
              tokenAmount={item}
              onPress={() => onTokenTransferPress(item)}
            />
          )
        })}
        <CoinComponent tokenAmount={"X"} onPress={onCustomAmountPress} />
      </HStack>
    </Fragment>
  )
}
