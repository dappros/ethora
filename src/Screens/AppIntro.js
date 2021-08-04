import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  screen0,
  screen1,
  screen2,
  screen3,
} from '../components/AppIntro/screenContents';
import {isSkipForever} from '../actions/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import ViewPager from '@react-native-community/viewpager';
import {commonColors, textStyles} from '../../docs/config';

const pagination = ['chats', 'qr', 'tokens', 'sharing'];

const {
  lightFont,
  mediumFont,
} = textStyles

const {
  primaryColor,
  secondaryColor
} = commonColors
class AppIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: pagination[0],
    };
  }

  renderPagination(page) {
    return (
      <View style={{flex: 1, flexDirection: 'row', marginBottom: hp('3.5%')}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flex: 0.8,
            paddingLeft: wp('18%'),
          }}>
          <EntypoIcons
            name="dot-single"
            color={page === 0 ? '#FFFFFF' : '#0000004D'}
            size={hp('3.23%')}
          />

          <EntypoIcons
            name="dot-single"
            color={page === 1 ? '#FFFFFF' : '#0000004D'}
            size={hp('3.23%')}
          />

          <EntypoIcons
            name="dot-single"
            color={page === 2 ? '#FFFFFF' : '#0000004D'}
            size={hp('3.23%')}
          />

          <EntypoIcons
            name="dot-single"
            color={page === 3 ? '#FFFFFF' : '#0000004D'}
            size={hp('3.23%')}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.onNavigationPress('SkipForever')}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 5,
            flex: 0.2,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: hp('3.46%'),
              height: hp('3.46%'),
              borderRadius: hp('3.46%') / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <EntypoIcons
              name="cross"
              color={page % 2 === 0 ? primaryColor : secondaryColor}
              style={{flex: 1}}
              size={hp('3.23%')}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderTitle(page) {
    let titleText = '';
    switch (page) {
      case 0:
        titleText = 'Chats & Notifications';
        break;

      case 1:
        titleText = 'QR code invites';
        break;

      case 2:
        titleText = 'Tokens - your wallet';
        break;

      case 3:
        titleText = 'Sharing and rewarding';
        break;
    }
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>{titleText}</Text>
      </View>
    );
  }

  renderNavigation(page) {
    return (
      <View>
        <View style={{flexDirection: 'row', width: '100%'}}>
          <TouchableOpacity
            disabled={page === 0}
            onPress={() => this.onNavigationPress('Previous', page)}
            style={[
              styles.navigationContainer,
              {
                width: wp('49.86%'),
                height: hp('6.03%'),
                backgroundColor: page === 0 ? null : '#0000004D',
              },
            ]}>
            {page === 0 ? null : (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.navigationTextStyle}> {'<'} Previous</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.onNavigationPress(page === 3 ? 'Done' : 'Next', page)
            }
            style={[
              styles.navigationContainer,
              {
                width: wp('49.86%'),
                height: hp('6.03%'),
                backgroundColor: '#00000080',
              },
            ]}>
            {page === 3 ? (
              <Text style={styles.navigationTextStyle}>Done</Text>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.navigationTextStyle}>Next {'>'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => this.onNavigationPress('SkipForever')}
            style={[
              styles.navigationContainer,
              {width: wp('49.86%'), height: hp('6.03%')},
            ]}>
            <Text style={styles.skipLinkStyle}>Skip forever</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.onNavigationPress('Skip')}
            disabled={this.state.page === pagination[3]}
            style={[
              styles.navigationContainer,
              {width: wp('49.86%'), height: hp('6.03%')},
            ]}>
            {this.state.page === pagination[3] ? null : (
              <Text style={styles.skipLinkStyle}>Skip just this time</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onSwipe(type) {
    const currentPage = this.state.page;
    if (type === 'Previous') {
      if (currentPage !== pagination[0]) {
        this.onNavigationPress(type);
      } else {
        return null;
      }
    }

    if (type === 'Next') {
      if (currentPage === pagination[3]) {
        this.onNavigationPress('Done');
      } else {
        this.onNavigationPress(type);
      }
    }

    return null;
  }

  scrollToInitialPosition = () => {
    setTimeout(() => {
      this.scrollRef.scrollTo({
        x: 0,
        y: 0,
        animated: Platform.OS === 'ios' ? true : true,
      });
    });
  };

  onNavigationPress(type, currentPage) {
    // const currentPage = this.state.page

    // let indexOfCurrentPage = pagination.indexOf(currentPage);
    switch (type) {
      case 'Previous':
        this.setState({
          page: pagination[currentPage - 1],
        });
        this.viewPageRef.setPage(currentPage - 1);
        // this.scrollToInitialPosition();
        // this.scrollRef.scrollTo({x: 0, y: 0, animated: Platform.OS==="ios"?true:true})
        break;

      case 'Next':
        this.setState({
          page: pagination[currentPage + 1],
        });
        this.viewPageRef.setPage(currentPage + 1);
        // this.scrollToInitialPosition();
        // this.scrollRef.scrollTo()
        break;

      case 'Done':
        this.props.navigation.navigate('ChatHomeComponent');
        break;

      case 'Skip':
        this.props.navigation.navigate('ChatHomeComponent');
        break;

      case 'SkipForever':
        AsyncStorage.setItem('@skipForever', '1');
        this.props.navigation.navigate('ChatHomeComponent');
    }
  }

  renderContent(page) {
    switch (page) {
      case 0:
        return screen0();

      case 1:
        return screen1();

      case 2:
        return screen2();

      case 3:
        return screen3();
    }
  }

  pageSelected(e) {
    this.setState({
      page: pagination[e.nativeEvent.position],
    });
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };

    return (
      <ViewPager
        ref={ref => (this.viewPageRef = ref)}
        onPageSelected={e => this.pageSelected(e)}
        scrollEnabled
        style={styles[this.state.page].container}
        initialPage={0}>
        <View style={{alignItems: 'center', width: '100%'}} key="1">
          <SafeAreaView>
            <ScrollView style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                {this.renderPagination(0)}
                {this.renderTitle(0)}
                {screen0()}
                {this.renderNavigation(0)}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
        <View style={{alignItems: 'center', width: '100%'}} key="2">
          <SafeAreaView>
            <ScrollView style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                {this.renderPagination(1)}
                {this.renderTitle(1)}
                {screen1()}
                {this.renderNavigation(1)}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
        <View style={{alignItems: 'center'}} key="3">
          <SafeAreaView>
            <ScrollView style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                {this.renderPagination(2)}
                {this.renderTitle(2)}
                {screen2()}
                {this.renderNavigation(2)}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
        <View style={{alignItems: 'center'}} key="4">
          <SafeAreaView>
            <ScrollView style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                {this.renderPagination(3)}
                {this.renderTitle(3)}
                {screen3()}
                {this.renderNavigation(3)}
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </ViewPager>
    );
  }
}

const styles = {
  chats: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: primaryColor,
    },
  }),
  qr: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: secondaryColor,
    },
  }),
  tokens: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: primaryColor,
    },
  }),
  sharing: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: secondaryColor,
    },
  }),
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('88%'),
    height: hp('6.03%'),
    backgroundColor: '#00000080',
  },
  titleStyle: {
    fontFamily: mediumFont,
    fontSize: hp('1.97%'),
    color: '#FFFFFF',
  },
  navigationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationTextStyle: {
    fontFamily: mediumFont,
    color: '#FFFFFF',
    fontSize: hp('1.72%'),
  },
  skipLinkStyle: {
    fontFamily: lightFont,
    fontSize: hp('1.47%'),
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
};

const mapStateToProps = state => {
  return {
    ...state,
  };
};

module.exports = connect(
  mapStateToProps,
  {
    isSkipForever,
  },
)(AppIntro);
