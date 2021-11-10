/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import CustomHeader from '../components/shared/customHeader';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Divider} from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {fetchTransaction} from '../actions/wallet';
import {queryAllTransactions} from '../components/realmModels/transaction';
import {
  commonColors,
  textStyles,
  coinImagePath,
  coinsMainName,
} from '../../docs/config';

const {primaryColor} = commonColors;

const {lightFont, semiBoldFont, boldFont} = textStyles;

const renderTabBar = props => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: '#F3F3F3',
        height: '100%',
        shadowColor: '#00000029',
        shadowOpacity: 1.0,
      }}
      contentContainerStyle={{height: hp('7.3%')}}
      style={{backgroundColor: 'white'}}
      renderLabel={route => (
        <Text
          style={{
            fontFamily: boldFont,
            color: primaryColor,
            fontSize: hp('2.2%'),
          }}>
          {route.route.title}
        </Text>
      )}
    />
  );
};

const TransactionListComponent = props => {
  const month = new Array();
  month[0] = 'Jan';
  month[1] = 'Feb';
  month[2] = 'March';
  month[3] = 'April';
  month[4] = 'May';
  month[5] = 'June';
  month[6] = 'July';
  month[7] = 'Aug';
  month[8] = 'Sept';
  month[9] = 'Oct';
  month[10] = 'Nov';
  month[11] = 'Dec';
  const today = new Date();
  let Header = null;

  let fullName = '';
  let firstName = '';
  let lastName = '';

  if (props.item.from === props.walletAddress) {
    firstName = props.item.toFirstName
      ? props.item.toFirstName === 'N/A'
        ? 'Anonymous'
        : props.item.toFirstName
      : 'Anonymous';
    lastName = props.item.toLastName
      ? props.item.toLastName === 'N/A'
        ? ''
        : props.item.toLastName
      : '';
    fullName = firstName + ' ' + lastName;
  } else {
    firstName = props.item.fromFirstName
      ? props.item.fromFirstName === 'N/A'
        ? 'Anonymous'
        : props.item.fromFirstName
      : 'Anonymous';
    lastName = props.item.fromLastName
      ? props.item.fromLastName === 'N/A'
        ? ''
        : props.item.fromLastName
      : '';
    fullName = firstName + ' ' + lastName;
  }

  if (props.showHeader) {
    if (props.currentHeaderDate.getTime() === today.getTime()) {
      Header = (
        <View
          style={{
            backgroundColor: '#7E7E7E',
            height: hp('3%'),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: lightFont,
              textAlign: 'center',
              color: 'white',
            }}>
            Today
          </Text>
        </View>
      );
    } else {
      Header = (
        <View
          style={{
            backgroundColor: '#7E7E7E',
            height: hp('3%'),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: lightFont,
              textAlign: 'center',
              color: 'white',
            }}>
            {props.currentHeaderDate.getDate()}{' '}
            {month[props.currentHeaderDate.getMonth()]}{' '}
            {props.currentHeaderDate.getFullYear()}
          </Text>
        </View>
      );
    }
  }
  return (
    <View key={props.item.transactionHash} style={{flex: 1}}>
      {Header}
      <View style={{flexDirection: 'row', margin: 20}}>
        <View style={{flex: 0.1}}>
          <View
            style={{
              width: hp('3%'),
              height: hp('3%'),
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: primaryColor,
            }}
            borderRadius={hp('3%') / 2}>
            <Text
              style={{
                fontSize: hp('1.46%'),
                color: 'white',
              }}>
              {firstName === 'Anonymous' ? 'A' : firstName[0] + lastName[0]}
            </Text>
          </View>
        </View>
        <View style={{flex: 0.7, marginLeft: wp('1.3%')}}>
          <Text style={{fontFamily: semiBoldFont, fontSize: hp('1.7%')}}>
            {fullName}
          </Text>
          <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
            Balance: {props.item.balance}
          </Text>
        </View>
        <View style={{flex: 0.2, flexDirection: 'row', alignItems: 'center'}}>
          {props.item.nftPreview !== 'null' ? (
            <Image
              source={{uri: props.item.nftPreview}}
              style={styles.imagePreviewStyle}
            />
          ) : (
            <Image source={coinImagePath} style={styles.tokenIconStyle} />
          )}

          <Text
            style={{
              fontFamily: semiBoldFont,
              fontSize: hp('1.7%'),
              margin: 5,
            }}>
            {props.item.value}
          </Text>
          <AntIcon
            name={
              props.item.from === props.walletAddress ? 'arrowup' : 'arrowdown'
            }
            color={
              props.item.from === props.walletAddress ? '#CB4141' : '#69CB41'
            }
            size={hp('1.7%')}
            style={{margin: 5}}
          />
          {props.item.from === props.item.to && (
            <AntIcon
              name="arrowdown"
              color="#69CB41"
              size={hp('1.7%')}
              style={{margin: 5}}
            />
          )}
        </View>
      </View>
      <Divider />
    </View>
  );
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};
const TransactionListFunction = props => {
  let currentHeaderDate = null;
  let transactions = props.transactions;
  const walletAddress = props.walletAddress;
  if (transactions.length > 0) {
    if (props.route === 'all') {
      return (
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              props.onEndReached();
            }
          }}
          style={{flex: 1, backgroundColor: 'white'}}>
          {transactions.map(item => {
            let showHeader = false;
            if (currentHeaderDate === null) {
              currentHeaderDate = item.timestamp;
              showHeader = true;
            }
            if (
              currentHeaderDate.getDate() +
                currentHeaderDate.getMonth() +
                currentHeaderDate.getFullYear() !==
              item.timestamp.getDate() +
                item.timestamp.getMonth() +
                item.timestamp.getFullYear()
            ) {
              currentHeaderDate = item.timestamp;
              showHeader = true;
            }

            return TransactionListComponent({
              showHeader,
              currentHeaderDate,
              item,
              walletAddress,
            });
          })}
        </ScrollView>
      );
    } else if (props.route === 'sent') {
      return (
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              props.onEndReached();
            }
          }}
          style={{flex: 1, backgroundColor: 'white'}}>
          {transactions.map(item => {
            let showHeader = false;
            if (currentHeaderDate === null) {
              currentHeaderDate = item.timestamp;
              showHeader = true;
            }
            if (
              currentHeaderDate.getDate() +
                currentHeaderDate.getMonth() +
                currentHeaderDate.getFullYear() !==
              item.timestamp.getDate() +
                item.timestamp.getMonth() +
                item.timestamp.getFullYear()
            ) {
              currentHeaderDate = item.timestamp;
              showHeader = true;
            }

            return (
              item.from === walletAddress &&
              TransactionListComponent({
                showHeader,
                currentHeaderDate,
                item,
                walletAddress,
              })
            );
          })}
        </ScrollView>
      );
    }
    if (props.route === 'received') {
      return (
        <ScrollView
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              props.onEndReached();
            }
          }}
          style={{flex: 1, backgroundColor: 'white'}}>
          {transactions.map(item => {
            let showHeader = false;
            if (currentHeaderDate === null) {
              currentHeaderDate = item.timestamp;
              showHeader = true;
            }
            if (
              currentHeaderDate.getDate() +
                currentHeaderDate.getMonth() +
                currentHeaderDate.getFullYear() !==
              item.timestamp.getDate() +
                item.timestamp.getMonth() +
                item.timestamp.getFullYear()
            ) {
              currentHeaderDate = item.timestamp;
              showHeader = true;
            }

            return (
              item.to === walletAddress &&
              TransactionListComponent({
                showHeader,
                currentHeaderDate,
                item,
                walletAddress,
              })
            );
          })}
        </ScrollView>
      );
    } else return null;
  } else {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: wp('5%'),
          height: '100%',
          width: '100%',
        }}>
        <Image
          source={require('../assets/transactions-empty.png')}
          style={{
            resizeMode: 'stretch',
            height: hp('21.50%'),
            width: wp('47.69%'),
          }}
        />
        <Text
          style={{
            fontFamily: semiBoldFont,
            fontSize: hp('2.21%'),
            color: primaryColor,
            marginTop: hp('1.7%'),
          }}>
          You have no transactions
        </Text>
        <Text
          style={{
            fontFamily: lightFont,
            fontSize: hp('1.72%'),
            textAlign: 'center',
            marginTop: hp('1.7%'),
          }}>
          Long press any chat message of your choice and make your first
          transaction.
        </Text>
      </View>
    );
  }
};

const initialLayout = {width: Dimensions.get('window').width};

class TransactionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      routes: [
        {key: 'first', title: 'All'},
        {key: 'second', title: 'Sent'},
        {key: 'third', title: 'Received'},
      ],
      transactionObject: [],
      walletAddress: '',
      filterType: 'default',
    };
  }

  componentDidMount() {
    const initialData = this.props.loginReducer.initialData;
    const walletAddress = initialData.walletAddress;
    queryAllTransactions(coinsMainName).then(transactions => {
      let balance = 0;
      if (transactions.length > 0) {
        transactions.map(item => {
          if (item.tokenId === 'NFT') {
            if (
              item.from === this.state.walletAddress &&
              item.from !== item.to
            ) {
              balance = balance;
              item.balance = item.senderBalance + '/' + item.nftTotal;
            } else {
              item.balance = item.receiverBalance + '/' + item.nftTotal;
            }

            return item;
          } else if (
            item.from === this.state.walletAddress &&
            item.from !== item.to
          ) {
            item.balance = item.senderBalance;
            balance = balance - item.value;
          } else {
            item.balance = item.receiverBalance;
            balance = balance + item.value;
          }
        });
      }
      // console.log(transactions, 'transindidmount');

      this.setState({
        transactionObject: transactions.reverse(),
        walletAddress,
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.walletReducer.transactions !==
      this.props.walletReducer.transactions
    ) {
      queryAllTransactions(coinsMainName).then(transactions => {
        // console.log(transactions, 'thisistransacts');
        let balance = 0;
        if (transactions.length > 0) {
          console.log('entered');
          transactions.map(item => {
            if (item.tokenId === 'NFT') {
              if (
                item.from === this.state.walletAddress &&
                item.from !== item.to
              ) {
                balance = balance;
                item.balance = item.senderBalance + '/' + item.nftTotal;
              } else {
                item.balance = item.receiverBalance + '/' + item.nftTotal;
              }

              return item;
            } else if (
              item.from === this.state.walletAddress &&
              item.from !== item.to
            ) {
              item.balance = item.senderBalance;
              balance = balance - item.value;
            } else {
              item.balance = item.receiverBalance;
              balance = balance + item.value;
            }
          });
        }
        console.log(transactions, 'transindidmount');

        this.setState({
          transactionObject: transactions.reverse(),
        });
      });
    }
  }

  renderScene = ({route}) => {
    const initialData = this.props.loginReducer.initialData;
    const walletAddress = initialData.walletAddress;
    const token = this.props.loginReducer.token;
    switch (route.key) {
      case 'first':
        return (
          <TransactionListFunction
            route="all"
            walletAddress={walletAddress}
            transactions={this.state.transactionObject}
            onEndReached={() => {
              if (
                this.props.walletReducer.transactions.length <
                this.props.walletReducer.total
              ) {
                this.props.fetchTransaction(
                  this.state.walletAddress,
                  this.props.loginReducer.token,
                  true,
                  this.props.walletReducer.limit,
                  this.props.walletReducer.offset,
                );
              }
            }}
          />
        );

      case 'second':
        return (
          <TransactionListFunction
            route="sent"
            onEndReached={() => {
              if (
                this.props.walletReducer.transactions.length <
                this.props.walletReducer.total
              ) {
                this.props.fetchTransaction(
                  this.state.walletAddress,
                  this.props.loginReducer.token,
                  true,
                  this.props.walletReducer.limit,
                  this.props.walletReducer.offset,
                );
              }
            }}
            walletAddress={walletAddress}
            transactions={this.state.transactionObject}
          />
        );

      case 'third':
        return (
          <TransactionListFunction
            route="received"
            onEndReached={() => {
              if (
                this.props.walletReducer.transactions.length <
                this.props.walletReducer.total
              ) {
                this.props.fetchTransaction(
                  this.state.walletAddress,
                  this.props.loginReducer.token,
                  true,
                  this.props.walletReducer.limit,
                  this.props.walletReducer.offset,
                );
              }
            }}
            walletAddress={walletAddress}
            transactions={this.state.transactionObject}
          />
        );

      default:
        return null;
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <CustomHeader
          filterType={filterType => this.setState({filterType})}
          type="transaction"
          title="Transactions"
          navigation={this.props.navigation}
        />
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{
            index: this.state.tabIndex,
            routes: this.state.routes,
          }}
          renderScene={this.renderScene}
          onIndexChange={index => this.setState({tabIndex: index})}
          initialLayout={initialLayout}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tokenIconStyle: {
    height: hp('3%'),
    width: hp('3%'),
  },
  imagePreviewStyle: {
    height: hp('5%'),
    width: hp('7%'),
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(mapStateToProps, {
  fetchTransaction,
})(TransactionScreen);
