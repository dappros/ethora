import { observer } from "mobx-react-lite"
import { HStack, VStack } from "native-base"
import React from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native"

import IonIcons from "react-native-vector-icons/Ionicons"

import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5"

import moment from "moment"
import { commonColors, textStyles } from "../../../docs/config"
import { underscoreManipulation } from "../../helpers/underscoreLogic"
import { BlackListUser } from "../../stores/chatStore"
import { useStores } from "../../stores/context"
import { removeUserFromBlackList } from "../../xmpp/stanzas"
export interface IBlocking {}

export const Blocking: React.FC<IBlocking> = observer(({}) => {
  const { chatStore, loginStore } = useStores()
  const manipulatedWalletAddress = underscoreManipulation(
    loginStore.initialData.walletAddress
  )
  const unblockUser = (addressToRemove: string) => {
    removeUserFromBlackList(
      manipulatedWalletAddress,
      addressToRemove,
      chatStore.xmpp
    )
  }
  const UserItem = ({ item }: { item: BlackListUser }) => (
    <HStack
      alignItems={"center"}
      // borderBottomWidth={1}
      borderRadius={10}
      justifyContent={"space-between"}
      marginBottom={"4"}
      w="full"
    >
      <HStack alignItems={"center"}>
        <FontAwesomeIcons
          name="user-circle"
          size={40}
          color={commonColors.primaryColor}
          style={{ marginRight: 10 }}
        />

        <VStack>
          <Text style={styles.userName}>{item.name}</Text>
          <Text>{moment(item.date).format("DD MMMM YYYY")}</Text>
        </VStack>
      </HStack>
      <TouchableOpacity onPress={() => unblockUser(item.userJid.split("@")[0])}>
        <IonIcons name="remove-circle" size={30} color={"darkred"} />
      </TouchableOpacity>
    </HStack>
  )
  const renderItem = ({ item }: { item: BlackListUser }) => (
    <UserItem item={item} />
  )

  return (
    <VStack paddingX={5}>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.title}>Users you have blocked</Text>
        <Text style={styles.description}>
          The blocked users cannot message you or view your profile. Tap the bin
          icon if you wish to remove the block.
        </Text>
        <View style={{ marginTop: 10 }}>
          {chatStore.blackList.length ? (
            <FlatList
              data={chatStore.blackList}
              renderItem={renderItem}
              keyExtractor={(item) => item.userJid}
            />
          ) : (
            <Text style={styles.title}>No blocked users.</Text>
          )}
        </View>
      </View>
    </VStack>
  )
})

const styles = StyleSheet.create({
  title: {
    fontFamily: textStyles.semiBoldFont,
    color: "black",
    fontSize: 16,
    marginVertical: 5,
  },
  description: {
    fontFamily: textStyles.regularFont,
    color: "black",
  },
  userName: {
    color: "black",
    // width: '90%',
    fontFamily: textStyles.semiBoldFont,
    fontSize: 14,
  },
})
