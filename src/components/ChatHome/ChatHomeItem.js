import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {commonColors, textStyles} from '../../../docs/config';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

export const ChatHomeItem = ({item, onItemPress, onItemLongPress}) => {
  return (
    <TouchableOpacity
      onPress={onItemPress}
      activeOpacity={0.6}
      onLongPress={onItemLongPress}
      // style={{
      //   backgroundColor: activeMenuIndex === index ? 'lightgrey' : 'white',
      // }}
    >
      <View style={styles.container}>
        <View
          style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {item.counter ? (
            <View style={styles.counterContainer}>
              <View style={styles.counterInnerContainer}>
                <Text style={styles.counterText}>{item.counter}</Text>
              </View>
            </View>
          ) : null}
          <ImageBackground
            imageStyle={{borderRadius: 5}}
            style={styles.imageBackground}>
            <View style={styles.chatHomeItemIcon}>
              <Text style={styles.initialsText}>
                {' '}
                {item.name[0] + (item.name[1] ? item.name[1] : '')}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View
          style={{
            justifyContent: 'center',
            marginLeft: wp('0.1%'),
            flex: 1,
          }}>
          <Text numberOfLines={1} style={styles.nameText}>
            {item.name}
            {item.muted && (
              <IonIcon
                name="volume-mute-outline"
                size={hp('2%')}
                style={{
                  marginRight: hp('0.9%'),
                  marginLeft: hp('0.4%'),
                }}
              />
            )}
          </Text>

          {item.lastUserName ? (
            <>
              <View style={{flexDirection: 'row', marginTop: hp('0.8%')}}>
                <Text numberOfLines={1} style={styles.text}>
                  {item.lastUserName}:{' '}
                </Text>
                <Text numberOfLines={1} style={styles.lastUserText}>
                  {item.lastUserText}
                </Text>
                <Text
                  style={
                    styles.lastUserTextTime
                  }>{` ${item.createdAt.getHours()}:${item.createdAt.getMinutes()}`}</Text>
              </View>
            </>
          ) : (
            <Text numberOfLines={1} style={styles.text}>
              Join this chat to view updates
            </Text>
          )}
        </View>
        <View style={{flex: 0.17}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{height: hp('3.8%'), width: wp('15%')}}>
              <View style={styles.chatHomeItemParticipants}>
                <MaterialIcon
                  name="group"
                  size={hp('2%')}
                  style={{
                    marginRight: hp('0.9%'),
                    marginLeft: hp('0.4%'),
                  }}
                />
                <Text
                  style={{
                    fontSize: hp('1.5%'),
                    fontFamily: textStyles.regularFont,
                  }}>
                  {item.participants}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  conteiner: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    marginRight: 0,
    marginLeft: 0,
  },
  counterContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    zIndex: 1,
    alignSelf: 'flex-end',
    height: hp('5.5%'),
    width: hp('5.5%'),
    marginTop: hp('1%'),
    marginRight: hp('0.5'),
  },
  counterInnerContainer: {
    height: hp('2.1%'),
    width: hp('2.1%'),
    borderRadius: hp('2.1') / 2,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    height: hp('5.5%'),
    width: hp('5.5%'),
    // flex: 1,
    borderRadius: 5,
    position: 'absolute',
  },
  initialsText: {
    color: 'white',
    marginRight: 3,
    //   fontFamily: mediumRobotoFont,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  nameText: {
    fontFamily: textStyles.mediumFont,
    fontSize: hp('2%'),
    color: '#4C5264',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastUserText: {
    fontFamily: textStyles.thinFont,
    fontSize: hp('1.8%'),
    color: '#4C5264',
    width: wp('30%'),
  },
  lastUserTextTime: {
    fontFamily: textStyles.regularFont,
    fontSize: hp('1.2%'),
    // flex: 1,
    color: '#BCC5D3',
    marginTop: hp('0.6%'),
  },
  counterText: {
    fontFamily: textStyles.regularFont,
    fontSize: hp('1%'),

    color: '#FFFFFF',
  },
  chatHomeItemParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    shadowOffset: {width: -1, height: 1},
    shadowColor: commonColors.primaryColor,
    shadowOpacity: 1.0,
    borderWidth: 1,
    borderColor: 'white',
    shadowRadius: 1,
    backgroundColor: 'white',

    height: 20,
    width: 40,
  },
  chatHomeItemIcon: {
    borderWidth: 1,
    borderColor: commonColors.primaryDarkColor,
    backgroundColor: commonColors.primaryDarkColor,
    height: hp('5.54%'),
    width: hp('5.54%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    borderRadius: hp('0.7%'),
  },
  text: {
    fontFamily: textStyles.regularFont,
    fontSize: hp('1.8%'),
    color: '#4C5264',
  },
});
