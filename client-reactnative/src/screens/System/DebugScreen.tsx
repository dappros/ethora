import React, { useEffect, useState } from "react"
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native"
import Highlighter from "react-native-highlight-words"

import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen"

import AntIcon from "react-native-vector-icons/AntDesign"
import Modal from "react-native-modal"
import { commonColors, textStyles } from "../../../docs/config"
import SecondaryHeader from "../../components/SecondaryHeader/SecondaryHeader"
import { useStores } from "../../stores/context"

const DebugScreenXmpp = ({ navigation }) => {
  const [searchText, setSearchText] = useState("")
  const [textForSearch, setTextForSearch] = useState("")
  const submit = () => {
    setTextForSearch(searchText)
  }
  const { debugStore } = useStores()

  const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      return value
    }
  }
  return (
    <View style={{ paddingBottom: 100 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search"
          placeholderTextColor={"black"}
          style={styles.searchInput}
          maxLength={50}
        />
        <TouchableOpacity style={styles.searchButton} onPress={submit}>
          <Text style={{ color: "white" }}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* <JSONTree data={textForSearch ? filteredLogs : logs} /> */}
        <View style={{ paddingLeft: 10 }}>
          {debugStore.xmppLogs
            .filter((log) =>
              JSON.stringify(log, getCircularReplacer()).includes(textForSearch)
            )
            .map((log, i) => {
              return (
                <Highlighter
                  key={i}
                  highlightStyle={{
                    backgroundColor: commonColors.primaryColor,
                  }}
                  searchWords={[textForSearch]}
                  textToHighlight={JSON.stringify(
                    log,
                    getCircularReplacer(),
                    2
                  )}
                />
              )
            })}
        </View>
      </ScrollView>

      {/* 
      {logs.map(log => (
        <Text key={JSON.stringify(log)}>{JSON.stringify(log, null, 2)}</Text>
      ))} */}
    </View>
  )
}
const DebugScreenApi = ({ navigation }) => {
  const { debugStore } = useStores()

  const [searchText, setSearchText] = useState("")
  const [textForSearch, setTextForSearch] = useState("")
  const [apiMode, setApiMode] = useState("")
  const [isModalVisible, setModalVisible] = useState(false)

  const submit = async () => {
    // let res = await http.httpGet('wallets/balance/' + walletAddress);
    // console.log(res);
    // dispatch(changeApiMode('prod'));
    // dispatch(changeToken('prod'));
    // dispatch(changeXmpp(prodXmpp));

    setTextForSearch(searchText)
  }

  return (
    <View style={{ paddingBottom: 100 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <TextInput
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search"
          placeholderTextColor={"black"}
          style={styles.searchInput}
          maxLength={50}
        />
        <TouchableOpacity style={styles.searchButton} onPress={submit}>
          <Text style={{ color: "white" }}>Search</Text>
        </TouchableOpacity>

        <View style={styles.selectContainer}>
          <Text
            style={{
              ...styles.textStyle,
              left: 5,
            }}
          >
            {" "}
            Api mode
          </Text>
          <Text
            style={{
              ...styles.textStyle,
              right: 40,
            }}
          >
            {" "}
            {apiMode}
          </Text>

          <View />
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <AntIcon
                // onPress={() => props.navigation.navigate('LoginComponent')}
                color={commonColors.primaryColor}
                name="caretdown"
                size={hp("2%")}
                style={{ marginRight: 5, marginBottom: 2 }}
              />
            </TouchableOpacity>
          </>
          {/* )} */}
        </View>
        {/* </View> */}
      </View>

      <ScrollView>
        {/* <JSONTree data={textForSearch ? filteredLogs : logs} /> */}
        <View style={{ paddingLeft: 10 }}>
          {debugStore.apiLogs
            .filter((log) => JSON.stringify(log).includes(textForSearch))
            .map((log, i) => {
              return (
                <Highlighter
                  key={i}
                  highlightStyle={{
                    backgroundColor: commonColors.primaryColor,
                  }}
                  searchWords={[textForSearch]}
                  textToHighlight={JSON.stringify(log, null, 2)}
                />
              )
            })}
        </View>
      </ScrollView>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.rarityItems}>
            <Text style={styles.modalItem}>api-dev.dappros.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rarityItems}>
            <Text style={styles.modalItem}>app.dappros.com</Text>
          </TouchableOpacity>

          {/* <Button title="Hide modal" onPress={toggleModal} /> */}
        </View>
      </Modal>

      {/* 
      {logs.map(log => (
        <Text key={JSON.stringify(log)}>{JSON.stringify(log, null, 2)}</Text>
      ))} */}
    </View>
  )
}
export function DebugScreen({ navigation }) {
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "first", title: "Xmpp logs" },
    { key: "second", title: "API logs" },
  ])
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: commonColors.primaryColor }}
    />
  )

  return (
    <>
      <SecondaryHeader
        // isQR={true}
        title="Debug mode"
        showVersion
      />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: DebugScreenXmpp,
          second: DebugScreenApi,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: wp("100%") }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 5,
    width: 60,
    padding: 7,
    marginLeft: 10,
    height: 30,
  },
  searchInput: {
    width: "40%",
    padding: 5,
    paddingLeft: 10,
    height: 30,
    borderWidth: 2,
    borderColor: commonColors.primaryDarkColor,
    borderRadius: 5,
  },

  selectContainer: {
    borderColor: commonColors.primaryColor,
    borderWidth: 1,
    // marginTop: 10,
    borderRadius: 5,
    marginLeft: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: wp("35%"),
    height: 30,
  },

  textStyle: {
    fontFamily: textStyles.lightFont,
    color: commonColors.primaryColor,
    position: "absolute",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  modalItem: {
    fontSize: hp("2.23%"),
    fontFamily: textStyles.regularFont,
    textAlign: "left",
    paddingLeft: 5,
    color: commonColors.primaryColor,
  },

  rarityItems: {
    paddingLeft: 5,
    paddingVertical: 5,
    borderBottomColor: commonColors.primaryColor,
    borderBottomWidth: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})
