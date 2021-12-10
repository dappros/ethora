import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Highlighter from 'react-native-highlight-words';
import {APP_TOKEN, commonColors, textStyles} from '../../docs/config';
import CustomHeader from '../components/shared/customHeader';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {urlDefault} from '../config/url';
import {fetchWalletBalance} from '../actions/wallet';
import {ApiService} from '../config/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeApiMode, changeToken, changeXmpp} from '../actions/apiAction';
import {devXmpp, nextToken, prodXmpp} from '../reducers/apiReducer';

import AntIcon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {logOut} from '../actions/auth';
import {clearLogs} from '../actions/debugActions';

const DebugScreenXmpp = ({navigation}) => {
  const logs = useSelector(state => state.debugReducer.xmppLogs);
  const [searchText, setSearchText] = useState('');
  const [textForSearch, setTextForSearch] = useState('');
  const submit = () => {
    setTextForSearch(searchText);
  };
  function lookup(obj, k) {
    for (var key in obj) {
      var value = obj[key];

      if (k == key) {
        return [k, value];
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        var y = lookup(value, k);
        if (y && y[0] == k) return y;
      }
      if (Array.isArray(value)) {
        // for..in doesn't work the way you want on arrays in some browsers
        //
        for (var i = 0; i < value.length; ++i) {
          var x = lookup(value[i], k);
          if (x && x[0] == k) return x;
        }
      }
    }

    return null;
  }

  return (
    <View style={{paddingBottom: 100}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          value={searchText}
          onChangeText={text => setSearchText(text)}
          placeholder="Search"
          placeholderTextColor={'black'}
          style={styles.searchInput}
          maxLength={50}
        />
        <TouchableOpacity style={styles.searchButton} onPress={submit}>
          <Text style={{color: 'white'}}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* <JSONTree data={textForSearch ? filteredLogs : logs} /> */}
        <View style={{paddingLeft: 10}}>
          {logs
            .filter(log => JSON.stringify(log).includes(textForSearch))
            .map((log, i) => {
              return (
                <Highlighter
                  key={i}
                  highlightStyle={{backgroundColor: commonColors.primaryColor}}
                  searchWords={[textForSearch]}
                  textToHighlight={JSON.stringify(log, null, 2)}
                />
              );
            })}
        </View>
      </ScrollView>

      {/* 
      {logs.map(log => (
        <Text key={JSON.stringify(log)}>{JSON.stringify(log, null, 2)}</Text>
      ))} */}
    </View>
  );
};
const DebugScreenApi = ({navigation}) => {
  const logs = useSelector(state => state.debugReducer.apiLogs);
  const walletAddress = useSelector(
    state => state.loginReducer.initialData.walletAddress,
  );
  const [url, setUrl] = useState(urlDefault);

  const [searchText, setSearchText] = useState('');
  const [textForSearch, setTextForSearch] = useState('');
  const dispatch = useDispatch();
  const http = new ApiService(url, APP_TOKEN);
  const [apiMode, setApiMode] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const submit = async () => {
    // let res = await http.httpGet('wallets/balance/' + walletAddress);
    // console.log(res);
    // dispatch(changeApiMode('prod'));
    // dispatch(changeToken('prod'));
    // dispatch(changeXmpp(prodXmpp));

    setTextForSearch(searchText);
  };
  useEffect(() => {
    // dispatch(fetchWalletBalance());
  }, []);

  const pickApiMode = mode => {
    setModalVisible(false);
    dispatch(changeApiMode(mode));
    dispatch(changeToken(mode));

    if (mode === 'prod') {
      dispatch(changeXmpp(prodXmpp));
    } else {
      dispatch(changeXmpp(devXmpp));
    }
    dispatch(clearLogs());
    dispatch(logOut());
  };

  return (
    <View style={{paddingBottom: 100}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
        <TextInput
          value={searchText}
          onChangeText={text => setSearchText(text)}
          placeholder="Search"
          placeholderTextColor={'black'}
          style={styles.searchInput}
          maxLength={50}
        />
        <TouchableOpacity style={styles.searchButton} onPress={submit}>
          <Text style={{color: 'white'}}>Search</Text>
        </TouchableOpacity>

        <View style={styles.selectContainer}>
          <Text
            style={{
              ...styles.textStyle,
              left: 5,
            }}>
            {' '}
            Api mode
          </Text>
          <Text
            style={{
              ...styles.textStyle,
              right: 40,
            }}>
            {' '}
            {apiMode}
          </Text>

          <View />
          <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <AntIcon
                // onPress={() => props.navigation.navigate('LoginComponent')}
                color={commonColors.primaryColor}
                name="caretdown"
                size={heightPercentageToDP('2%')}
                style={{marginRight: 5, marginBottom: 2}}
              />
            </TouchableOpacity>
          </>
          {/* )} */}
        </View>
        {/* </View> */}
      </View>

      <ScrollView>
        {/* <JSONTree data={textForSearch ? filteredLogs : logs} /> */}
        <View style={{paddingLeft: 10}}>
          {logs
            .filter(log => JSON.stringify(log).includes(textForSearch))
            .map((log, i) => {
              return (
                <Highlighter
                  key={i}
                  highlightStyle={{backgroundColor: commonColors.primaryColor}}
                  searchWords={[textForSearch]}
                  textToHighlight={JSON.stringify(log, null, 2)}
                />
              );
            })}
        </View>
      </ScrollView>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => pickApiMode('dev')}
            style={styles.rarityItems}>
            <Text style={styles.modalItem}>api-dev.dappros.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pickApiMode('prod')}
            style={styles.rarityItems}>
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
  );
};
export function DebugScreen({navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Xmpp logs'},
    {key: 'second', title: 'API logs'},
  ]);
  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: commonColors.primaryColor}}
    />
  );

  return (
    <>
      <CustomHeader
        // isQR={true}
        title="Debug mode"
        onQRPressed={() => this.QRPressed()}
        navigation={navigation}
        showVersion
      />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={SceneMap({
          first: DebugScreenXmpp,
          second: DebugScreenApi,
        })}
        onIndexChange={setIndex}
        initialLayout={{width: widthPercentageToDP('100%')}}
      />
    </>
  );
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
    width: '40%',
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

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: widthPercentageToDP('35%'),
    height: 30,
  },

  textStyle: {
    fontFamily: textStyles.lightFont,
    color: commonColors.primaryColor,
    position: 'absolute',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalItem: {
    fontSize: heightPercentageToDP('2.23%'),
    fontFamily: textStyles.regularFont,
    textAlign: 'left',
    paddingLeft: 5,
    color: commonColors.primaryColor,
  },

  rarityItems: {
    paddingLeft: 5,
    paddingVertical: 5,
    borderBottomColor: commonColors.primaryColor,
    borderBottomWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
