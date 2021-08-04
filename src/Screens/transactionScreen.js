import React, {Component, Fragment} from 'react';
import {View, Text, Dimensions, Image, ScrollView, StyleSheet} from 'react-native';
import CustomHeader from '../components/shared/customHeader';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Divider} from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {fetchTransaction} from '../actions/wallet';
import {queryAllTransactions} from '../components/realmModels/transaction';
import {commonColors, textStyles, coinImagePath, coinsMainName} from '../../docs/config';

const {primaryColor} = commonColors;

const {
  lightFont,
  semiBoldFont,
  boldFont
} = textStyles;

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
    firstName = props.item.toFirstName?props.item.toFirstName==="N/A"?"Anonymous":props.item.toFirstName:"Anonymous";
    lastName = props.item.toLastName?props.item.toLastName==="N/A"?"":props.item.toLastName:"";
    fullName = firstName + ' ' + lastName;
  } else {
    firstName = props.item.fromFirstName?props.item.fromFirstName==="N/A"?"Anonymous":props.item.fromFirstName:"Anonymous";
    lastName = props.item.fromLastName?props.item.fromLastName==="N/A"?"":props.item.fromLastName:"";
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
              {firstName==="Anonymous"?"A":
              firstName[0] + lastName[0]}
            </Text>
          </View>
        </View>
        <View style={{flex: 0.7, marginLeft: wp('1.3%')}}>
          <Text
            style={{fontFamily: semiBoldFont, fontSize: hp('1.7%')}}>
            {fullName}
          </Text>
          <Text style={{fontFamily: lightFont, fontSize: hp('1.6%')}}>
            Balance: {props.item.balance}
          </Text>
        </View>
        <View style={{flex: 0.2, flexDirection: 'row', alignItems: 'center'}}>
          <Image source={coinImagePath} style={styles.tokenIconStyle} />
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

const TransactionListFunction = props => {
  let currentHeaderDate = null;
  let transactions = props.transactions;
  const walletAddress = props.walletAddress;
  if (transactions.length > 0) {
    if (props.route === 'all') {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
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
        </View>
      );
    } else if (props.route === 'sent') {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
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
        </View>
      );
    }
    if (props.route === 'received') {
      return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <ScrollView>
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
        </View>
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
          if (item.from === walletAddress && item.from !== item.to) {
            item.balance = balance - item.value;
            balance = balance - item.value;
          } else if (item.from === item.to) {
            item.balance = balance;
            balance = balance;
          } else {
            item.balance = balance + item.value;
            balance = balance + item.value;
          }
        });
      }

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
        let balance = 0;
        if (transactions.length > 0) {
          transactions.map(item => {
            if (
              item.from === this.state.walletAddress &&
              item.from !== item.to
            ) {
              item.balance = balance - item.value;
              balance = balance - item.value;
            } else if (item.from === item.to) {
              item.balance = balance
              balance = balance;
            } else {
              item.balance = balance + item.value;
              balance = balance + item.value;
            }
          });
        }

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
          />
        );

      case 'second':
        return (
          <TransactionListFunction
            route="sent"
            walletAddress={walletAddress}
            transactions={this.state.transactionObject}
          />
        );

      case 'third':
        return (
          <TransactionListFunction
            route="received"
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

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(
  mapStateToProps,
  {
    fetchTransaction,
  },
)(TransactionScreen);


const styles = StyleSheet.create({
  tokenIconStyle:{
    height: hp("3%"),
    width: hp("3%")
  }
})