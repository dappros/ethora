/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

import React, {Component, Fragment, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import { TransactionListItem } from '../components/TransactionListItem';

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

            return (
              <TransactionListItem
                showHeader={showHeader}
                currentHeaderDate={currentHeaderDate}
                item={item}
                walletAddress={walletAddress}
              />
            );
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
              item.from === walletAddress && (
                <TransactionListItem
                  showHeader={showHeader}
                  currentHeaderDate={currentHeaderDate}
                  item={item}
                  walletAddress={walletAddress}
                />
              )
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
              item.to === walletAddress && (
                <TransactionListItem
                  showHeader={showHeader}
                  currentHeaderDate={currentHeaderDate}
                  item={item}
                  walletAddress={walletAddress}
                />
              )
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
  headerContainer: {
    backgroundColor: '#7E7E7E',
    height: hp('3%'),
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: lightFont,
    textAlign: 'center',
    color: 'white',
  },
  itemName: {
    width: hp('3%'),
    height: hp('3%'),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
  },
  itemNameText: {
    fontSize: hp('1.46%'),
    color: 'white',
  },
  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderWidth: 0.5,
    borderColor: '#00000029',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: hp('8.12%'),
  },
  tabItemText: {
    color: primaryColor,
    fontSize: hp('2.216%'),
    fontFamily: boldFont,
  },
  detailsItem: {
    flexDirection: 'row',
  },
  detailsItemTextBold: {
    fontWeight: '700',
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
