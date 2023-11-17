/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import { Box, HStack, Image, Text, VStack } from "native-base"
import React, { useState } from "react"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"
import { coinImagePath, commonColors, textStyles } from "../../../docs/config"
import AntIcon from "react-native-vector-icons/AntDesign"
import { TransactionsListitemDate } from "./TransactionsListItemDate"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { truncateString } from "../../helpers/chat/chatUtils"

interface TransactionListProps {
  showDate: string
  formattedDate: string
  blockNumber: string
  name: string
  balance: number
  transactionAmount: number
  image: string
  timestamp: string
  transactionHash: string
  transactionSender: string
  transactionReceiver: string
  transactionOwnerWalletAddress: string
  from: string
  to: string
}

export const TransactionsListItem = (props: TransactionListProps) => {
  const {
    transactionReceiver,
    transactionSender,
    transactionAmount,
    showDate,
    formattedDate,
    blockNumber,
    transactionHash,
    timestamp,
    image,
    balance,
    name,
    transactionOwnerWalletAddress,
    from,
    to,
  } = props
  const [expanded, setExpanded] = useState(false)
  const isTransactionOwner =
    from === transactionOwnerWalletAddress || to === from

  return (
    <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
      {showDate && <TransactionsListitemDate date={formattedDate} />}
      <Box borderColor="coolGray.200" borderWidth="1" p={"3"}>
        <HStack justifyContent={"space-between"}>
          <HStack>
            <VStack justifyContent={"center"} alignItems={"center"}>
              <Box
                w={hp("2.8%")}
                h={hp("2.8%")}
                rounded={"full"}
                bg={commonColors.primaryColor}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Text
                  fontSize={hp("1.46%")}
                  fontWeight={"bold"}
                  color={"white"}
                >
                  {name.slice(0, 2)}
                </Text>
              </Box>
            </VStack>
            <VStack ml={"2"}>
              <Box>
                <Text fontSize={hp("1.7%")} fontWeight={"bold"}>
                  {truncateString(name, 15)}
                </Text>
              </Box>
              <Box>
                <Text fontSize={hp("1.6%")} fontWeight={"light"}>
                  Balance: {balance}
                </Text>
              </Box>
            </VStack>
          </HStack>
          <HStack justifyContent={"center"} space={1} alignItems={"center"}>
            <Box>
              {image ? (
                <Image
                  alt="logo"
                  height={hp("3%")}
                  width={hp("3%")}
                  source={{ uri: image }}
                />
              ) : (
                <Image
                  alt="logo"
                  height={hp("2.8%")}
                  width={hp("2.8%")}
                  source={coinImagePath}
                />
              )}
            </Box>
            <Box>
              <Text fontWeight={"bold"}>{transactionAmount}</Text>
            </Box>
            <Box>
              <AntIcon
                name={isTransactionOwner ? "arrowup" : "arrowdown"}
                color={isTransactionOwner ? "#CB4141" : "#69CB41"}
                size={hp("1.7%")}
              />
            </Box>
          </HStack>
        </HStack>
        {expanded && (
          <View style={{ paddingHorizontal: 20 }}>
            {/* <Text style={styles.detailsItemTextBold}>Details:</Text> */}
            <View style={styles.detailsItem}>
              <Text style={styles.detailsItemTextBold}>TX hash: </Text>
              <Text style={{ textAlign: "left", color: "black" }}>
                {transactionHash}
              </Text>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsItemTextBold}>From:</Text>
              <View>
                <Text style={{ textAlign: "left" }}>{transactionSender}</Text>
              </View>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsItemTextBold}>To:</Text>
              <View>
                <Text style={{ textAlign: "left" }}>{transactionReceiver}</Text>
              </View>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsItemTextBold}>Timestamp:</Text>
              <View>
                <Text style={{ textAlign: "left" }}>
                  {new Date(timestamp).getTime()}
                </Text>
              </View>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsItemTextBold}>Value:</Text>
              <View>
                <Text style={{ textAlign: "left" }}>{transactionAmount}</Text>
              </View>
            </View>
            <View style={styles.detailsItem}>
              <Text style={styles.detailsItemTextBold}>Block:</Text>
              <View>
                <Text style={{ textAlign: "left" }}>
                  {String(blockNumber).replace(/(.)(?=(\d{3})+$)/g, "$1,")}
                </Text>
              </View>
            </View>

            {/* <Text>To: {JSON.stringify(item)}</Text> */}
          </View>
        )}
      </Box>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp("3%"),
    width: hp("3%"),
  },
  imagePreviewStyle: {
    height: hp("5%"),
    width: hp("7%"),
  },
  headerContainer: {
    backgroundColor: "#7E7E7E",
    height: hp("3%"),
    justifyContent: "center",
  },
  headerText: {
    fontFamily: textStyles.lightFont,
    textAlign: "center",
    color: "white",
  },
  itemName: {
    width: hp("4%"),
    height: hp("4%"),
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: commonColors.primaryColor,
    marginTop: 2,
  },
  itemNameText: {
    fontSize: hp("1.46%"),
    color: "white",
  },
  rowEnd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tabItemContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderWidth: 0.5,
    borderColor: "#00000029",
  },
  tabItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: hp("8.12%"),
  },
  tabItemText: {
    color: commonColors.primaryColor,
    fontSize: hp("2.216%"),
    fontFamily: textStyles.boldFont,
  },
  detailsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
    paddingRight: wp("20%"),
    maxWidth: "100%",
  },
  detailsItemTextBold: {
    width: wp("23%"),
    fontWeight: "700",
  },
})
