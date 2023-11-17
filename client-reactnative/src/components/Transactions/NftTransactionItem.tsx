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
import { NfmtTag } from "./NftListItem"
import { formatBigNumber } from "../../helpers/formatBigNumber"
import { weiToNormalUnits } from "../../helpers/weiToNormalUnits"

interface TransactionListProps {
  showDate: string
  formattedDate: string
  blockNumber: string
  senderName: string
  receiverName: string

  balance: number
  transactionAmount: number
  senderBalance: number
  receiverBalance: number
  value: string
  timestamp: string
  transactionHash: string
  transactionSender: string
  transactionReceiver: string
  transactionOwnerWalletAddress: string
  from: string
  to: string
  type: string
  nftTotal: string
  tokenName: string
  contractId?: string
  trait?: string
  cost?: string
}

interface IUserBlock {
  name: string
  balance: number
  total: string
}
const UserBlock = ({ name, balance, total }: IUserBlock) => {
  return (
    <HStack alignItems={"center"}>
      <VStack justifyContent={"center"} alignItems={"center"}>
        <Box
          w={hp("3.5%")}
          h={hp("3.5%")}
          rounded={"full"}
          bg={commonColors.primaryColor}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text
            fontSize={hp("1.46%")}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            color={"white"}
          >
            {name.slice(0, 2)}
          </Text>
        </Box>
      </VStack>
      <VStack ml={"2"} style={{ width: wp("30%") }}>
        <Box>
          <Text fontSize={hp("1.7%")} fontWeight={"bold"}>
            {name}
          </Text>
        </Box>
        {/* <Box>
          <Text fontSize={hp('1.6%')} fontWeight={'light'}>
            Balance: 
          </Text>
          <Text fontSize={hp('1.6%')} fontWeight={'light'}>
          {balance}/{total}
          </Text>
        </Box> */}
      </VStack>
    </HStack>
  )
}

const tokenTypes = { creation: "Token Creation", mint: "Mint" }
export const NftTransactionItem: React.FC<TransactionListProps> = ({
  transactionReceiver,
  transactionSender,
  transactionAmount,
  showDate,
  formattedDate,
  blockNumber,
  timestamp,
  transactionHash,
  senderName,
  receiverName,
  from,
  to,
  value,
  type,
  tokenName,
  senderBalance,
  receiverBalance,
  nftTotal,
  contractId,
  trait,
  cost,
}) => {
  const [expanded, setExpanded] = useState(false)
  // const parsedToken = JSON.parse(token);
  const renderTokenTypeName = () => {
    if (type === tokenTypes.mint) {
      const allTotals = nftTotal ? nftTotal.split(",") : []

      const currentTotal = allTotals[+parseInt(contractId as string) - 1]

      return (
        <HStack
          style={{ width: wp("60%"), marginRight: "auto" }}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <HStack style={{ width: wp("30%") }} alignItems={"center"}>
            <Text fontFamily={textStyles.boldFont} fontSize={hp("1.46%")}>
              {value}
            </Text>
            {!!trait && <NfmtTag tag={trait} />}
            <Text fontSize={hp("1.46%")}>
              (of {currentTotal || nftTotal || ""} total)
            </Text>
          </HStack>
          <HStack style={{ width: wp("20%") }} alignItems={"center"}>
            {cost ? (
              <Text fontSize={hp("1.46%")}>
                purchased for{" "}
                {formatBigNumber(Math.round(weiToNormalUnits(+cost)))}{" "}
                <Image
                  alt="coin icon"
                  style={{ width: 12, height: 12 }}
                  source={coinImagePath}
                  resizeMode={"cover"}
                />{" "}
                by
              </Text>
            ) : (
              <Text fontSize={hp("1.46%")}>NFTs minted by</Text>
            )}
          </HStack>
        </HStack>
      )
    }
    if (type === tokenTypes.creation) {
      return (
        <HStack
          style={{ width: wp("60%"), marginRight: "auto" }}
          justifyContent={"space-around"}
        >
          <Text fontFamily={textStyles.boldFont}>
            {tokenName || "Document"}
          </Text>
          <Text fontSize={hp("1.4%")}>{"deployed 🔗📜 by"}</Text>
        </HStack>
      )
    } else {
      return (
        <HStack
          style={{ width: wp("55%") }}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <UserBlock
            name={senderName}
            balance={senderBalance}
            total={nftTotal}
          />
          <AntIcon
            name={"arrowright"}
            color={"#69CB41"}
            size={hp("1.7%")}
            style={{ marginRight: 30 }}
          />
        </HStack>
      )
    }
  }
  return (
    <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
      {showDate && <TransactionsListitemDate date={formattedDate} />}
      <Box borderColor="coolGray.200" borderWidth="1" p={"3"}>
        <HStack
          justifyContent={"space-between"}
          alignItems={"center"}
          width={wp("100%")}
        >
          <HStack justifyContent={"center"} space={1} alignItems={"center"}>
            {renderTokenTypeName()}
            <HStack
              style={{ width: wp("33%") }}
              justifyContent={"flex-start"}
              marginLeft={"auto"}
            >
              <UserBlock
                name={receiverName}
                balance={receiverBalance}
                total={nftTotal}
              />
              <HStack justifyContent={"flex-end"} alignItems={"center"}>
                {/* <Text fontWeight={"bold"}>{transactionAmount}</Text> */}
              </HStack>
            </HStack>
          </HStack>
        </HStack>
      </Box>
      {expanded && (
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
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
              <Text style={{ textAlign: "left" }}>{from}</Text>
            </View>
          </View>
          <View style={styles.detailsItem}>
            <Text style={styles.detailsItemTextBold}>To:</Text>
            <View>
              <Text style={{ textAlign: "left" }}>{to}</Text>
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
              <Text style={{ textAlign: "left" }}>{value}</Text>
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
