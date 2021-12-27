import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {commonColors, defaultChats, textStyles} from '../../docs/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {useSelector} from 'react-redux';

const {primaryColor, primaryDarkColor} = commonColors;
const {regularFont, thinFont, lightFont, mediumFont} = textStyles;

export const ChatDragItem = ({
  item,
  index,
  drag,
  renameChat,
  leaveChat,
  unsubscribeFromRoom,
  openChat,
  activeMenuIndex,
  movingActive,
}) => {
  const ref = useRef();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const roomRoles = useSelector(state => state.ChatReducer.roomRoles);
  const stopAnimation = () => {
    // Animated.sequence(animation).stop();
    animation.stopAnimation();
    animation.setValue(0);
  };
  const startShake = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    if (movingActive) {
      startShake();
    } else {
      stopAnimation();
    }
  }, [movingActive]);
  const LeftActions = (progress, dragX) => {
    return (
      <>
        {/* <TouchableOpacity
            onPress={() => {
              unsubscribeFromRoom(item.jid);
              ref.current.close();
            }}>
            <View
              style={[styles.swipeActionItem, {backgroundColor: 'grey'}]}>
              <IonIcons name="notifications" size={hp('3%')} color={'white'} />
            </View>
          </TouchableOpacity> */}
        {roomRoles[item.jid] !== 'participant' && (
          <TouchableOpacity
            onPress={() => {
              renameChat(item.jid, item.name);
              ref.current.close();
            }}>
            <View
              style={[
                styles.swipeActionItem,
                {backgroundColor: primaryDarkColor},
              ]}>
              <AntIcon color={'white'} size={hp('3%')} name={'edit'} />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };
  const RightActions = (progress, dragX) => {
    const jidWithoutConference = item.jid?.split('@')[0];
    return (
      <>
        {!defaultChats[jidWithoutConference] && (
          <TouchableOpacity
            onPress={() => {
              leaveChat(item.jid);
              ref.current.close();
            }}>
            <View style={[styles.swipeActionItem, {backgroundColor: 'red'}]}>
              <AntIcon color={'white'} size={hp('3%')} name={'delete'} />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <Swipeable
      ref={ref}
      renderLeftActions={LeftActions}
      renderRightActions={RightActions}>
      {/* <ChatHomeItem onItemPress={() => openChat(item.jid, item.name)} onItemLongPress={drag} item={item} /> */}
      <Animated.View style={{transform: [{translateX: animation}]}}>
        <TouchableOpacity
          onPress={() => openChat(item.jid, item.name)}
          activeOpacity={0.6}
          onLongPress={() => movingActive && drag()}
          style={{
            backgroundColor: activeMenuIndex === index ? 'lightgrey' : 'white',
          }}
          key={index}>
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
                    <Text
                      style={{
                        fontFamily: regularFont,
                        fontSize: hp('1%'),

                        color: '#FFFFFF',
                      }}>
                      {item.counter}
                    </Text>
                  </View>
                </View>
              ) : null}
              <ImageBackground
                imageStyle={{borderRadius: 5}}
                style={styles.imageBg}>
                <View style={styles.chatHomeItemIcon}>
                  <Text style={styles.fullName}>
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
              <Text numberOfLines={1} style={styles.textName}>
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
                <View style={{flexDirection: 'row', marginTop: hp('0.8%')}}>
                  <Text numberOfLines={1} style={styles.lastNameText}>
                    {item.lastUserName}:{' '}
                  </Text>
                  <Text numberOfLines={1} style={styles.lastUserText}>
                    {item.lastUserText}
                  </Text>
                  <Text style={styles.date}>
                    {moment(item.createdAt).format('HH:mm')}
                  </Text>
                </View>
              ) : (
                <Text numberOfLines={1} style={styles.noInfo}>
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
                        fontFamily: regularFont,
                      }}>
                      {item.participants}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeActionItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    // borderRadius: 4
  },
  fullName: {
    color: 'white',
    marginRight: 3,
    //   fontFamily: mediumRobotoFont,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  chatHomeItemParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    shadowOffset: {width: -1, height: 1},
    shadowColor: primaryColor,
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
    borderColor: primaryDarkColor,
    backgroundColor: primaryDarkColor,
    height: hp('5.54%'),
    width: hp('5.54%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    borderRadius: hp('0.7%'),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 20,
  },
  modalInput: {
    borderWidth: 0.5,
    // borderTopWidth: 0,
    borderColor: primaryColor,
    backgroundColor: 'white',
    width: wp('81%'),
    height: hp('6.8%'),
    // padding: hp('2.4'),
    paddingLeft: wp('3.73'),
    borderRadius: 0,
    marginBottom: 10,
    // marginTop: 10
  },
  modalButton: {
    backgroundColor: primaryColor,
    borderRadius: 5,
    height: hp('4.3'),
    padding: 4,
  },
  modalInputText: {
    fontFamily: lightFont,
    fontSize: hp('1.6%'),
    color: 'black',
  },
  container: {
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
  imageBg: {
    height: hp('5.5%'),
    width: hp('5.5%'),
    // flex: 1,
    borderRadius: 5,
    position: 'absolute',
  },
  textName: {
    fontFamily: mediumFont,
    fontSize: hp('2%'),
    color: '#4C5264',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastNameText: {
    fontFamily: regularFont,
    fontSize: hp('1.8%'),
    color: '#4C5264',
  },
  lastUserText: {
    fontFamily: thinFont,
    fontSize: hp('1.8%'),
    color: '#4C5264',
    width: wp('30%'),
  },
  date: {
    fontFamily: regularFont,
    fontSize: hp('1.2%'),
    position: 'absolute',
    right: -25,
    // flex: 1,
    color: '#BCC5D3',
    marginTop: hp('0.6%'),
  },
  noInfo: {
    fontFamily: thinFont,
    fontSize: hp('1.8%'),
    color: '#4C5264',
  },
});
