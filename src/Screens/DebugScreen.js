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
import {APP_TOKEN, commonColors} from '../../docs/config';
import CustomHeader from '../components/shared/customHeader';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {urlDefault} from '../config/url';
import {fetchWalletBalance} from '../actions/wallet';
import {ApiService} from '../config/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeApiMode, changeToken} from '../actions/apiAction';
import { nextToken } from '../reducers/apiReducer';

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
  const submit = async () => {
    // let res = await http.httpGet('wallets/balance/' + walletAddress);
    // console.log(res);
    // dispatch(changeApiMode('prod'));
    // dispatch(changeToken('prod'));

    setTextForSearch(searchText);
  };
  useEffect(() => {
    // dispatch(fetchWalletBalance());
  }, []);

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
  },
  searchInput: {
    width: '80%',
    padding: 0,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: commonColors.primaryDarkColor,
    borderRadius: 5,
  },
});
