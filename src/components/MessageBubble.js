/*
Copyright 2019-2021 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
*/

/*
Part of this file uses or imports open-source code from GiftedChat project. 
Please note the GiftedChat code is distributed under its own license. At the time of this publication it is MIT license.
Refer to GiftedChat project and its license via their official repository: https://github.com/FaridSafi/react-native-gifted-chat/blob/master/LICENSE
*/

import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  Clipboard,
  StyleSheet,
  View,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Color from '../constants/colors';
import {coinImagePath} from '../../docs/config';

import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';

const { isSameUser, isSameDay, StylePropType } = utils;

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      initialAnimationValue: new Animated.Value(0)
    }
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else {
      if (this.props.currentMessage.text) {
        const options = [
          'Copy Text',
          'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
          }
        });
      }
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [styles.content.userTextStyleLeft, messageTextStyle],
            right:[styles.content.userTextStyleLeft]
          }}
        />
      );
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} imageStyle={[styles.slackImage, messageImageProps.imageStyle]} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderUsername() {
    const username = this.props.currentMessage.user.name;
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = this.props;
      if (this.props.renderUsername) {
        return this.props.renderUsername(usernameProps);
      }
      return (
        <View style={styles.content.usernameView}>
          <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
            {username}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
        />
      );
    }
    return null;
  }

  renderTokenCount() {
    if(this.props.currentMessage.tokenAmount){
      // this.startAnimation();
      const {containerStyle, position, wrapperStyle} = this.props;
      return(
          <View style={[
                styles[position].tokenContainerStyle,
            ]}>
          <Text style={[
          styles[position].tokenTextStyle,
          ]}>
            {/* {this.props.currentMessage.tokenAmount} */}
            {this.props.currentMessage.tokenAmount} 
          </Text>
          <Image source={coinImagePath} style={styles[position].tokenIconStyle} />
        </View>
      )
    }
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  styledBubbleToNext() {
    const { currentMessage, nextMessage, position, containerToNextStyle, } = this.props;
    if (currentMessage &&
        nextMessage &&
        position &&
        isSameUser(currentMessage, nextMessage) &&
        isSameDay(currentMessage, nextMessage)) {
        return [
            styles[position].containerToNext,
            containerToNextStyle && containerToNextStyle[position],
        ];
    }
    return null;
  }

  styledBubbleToPrevious() {
    const { currentMessage, previousMessage, position, containerToPreviousStyle, } = this.props;
    if (currentMessage &&
        previousMessage &&
        position &&
        isSameUser(currentMessage, previousMessage) &&
        isSameDay(currentMessage, previousMessage)) {
        return [
            styles[position].containerToPrevious,
            containerToPreviousStyle && containerToPreviousStyle[position],
        ];
    }
    return null;
  }

  // need to work
  // renderMessageVideo() {
  //   if (this.props.currentMessage && this.props.currentMessage.video) {
  //       const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
  //       if (this.props.renderMessageVideo) {
  //           return this.props.renderMessageVideo(messageVideoProps);
  //       }
  //       return <MessageVideo {...messageVideoProps}/>;
  //   }
  //   return null;
  // }
  // renderMessageAudio() {
  //     if (this.props.currentMessage && this.props.currentMessage.audio) {
  //         const { containerStyle, wrapperStyle, ...messageAudioProps } = this.props;
  //         if (this.props.renderMessageAudio) {
  //             return this.props.renderMessageAudio(messageAudioProps);
  //         }
  //         return <MessageAudio {...messageAudioProps}/>;
  //     }
  //     return null;
  // }

  renderQuickReplies() {
    // const { currentMessage, onQuickReply, nextMessage, renderQuickReplySend, quickReplyStyle, } = this.props;
    // if (currentMessage && currentMessage.quickReplies) {
    //     const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
    //     if (this.props.renderQuickReplies) {
    //         return this.props.renderQuickReplies(quickReplyProps);
    //     }
    //     return (<QuickReplies {...{
    //         currentMessage,
    //         onQuickReply,
    //         nextMessage,
    //         renderQuickReplySend,
    //         quickReplyStyle,
    //     }}/>);
    // }
    return null;
}

startAnimation=()=>{
    Animated.timing(this.state.initialAnimationValue,{
      toValue: 100,
      duration:500,
      useNativeDriver:false
    }).start(()=>{
      Animated.timing(this.state.initialAnimationValue,{
        toValue: 0,
        duration: 500,
        useNativeDriver: false
      }).start()
    })
}

  renderBubbleContent() {
    return this.props.isCustomViewBottom ? (<View>
    {this.renderMessageImage()}
    {/* {this.renderMessageVideo()}
    {this.renderMessageAudio()} */}
    {this.renderMessageText()}
    {this.renderCustomView()}
    </View>) : (<View>
      {this.renderCustomView()}
      {this.renderMessageImage()}
      {/* {this.renderMessageVideo()}
      {this.renderMessageAudio()} */}
      {this.renderMessageText()}
    </View>);
  }

  render() {  
    const { position, containerStyle, wrapperStyle, bottomContainerStyle, currentMessage, previousMessage } = this.props;
        const AnimatedStyle = {
          backgroundColor: this.state.initialAnimationValue.interpolate({
            inputRange:[0, 100],
            outputRange: [position==="left"?Color.leftBubbleBackground:Color.defaultBlue,"#F0B310"]
          })
        }
        return (
        <View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
        ]}>
          <Animated.View style={[
            styles[position].wrapper,
            this.styledBubbleToNext(),
            this.styledBubbleToPrevious(),
            wrapperStyle && wrapperStyle[position],
            AnimatedStyle
          ]}>
            {   !isSameUser(currentMessage,previousMessage)?
                this.renderUsername():null
            }
            <TouchableWithoutFeedback onLongPress={this.onLongPress} accessibilityTraits='text' {...this.props.touchableProps}>
            <View>
              {this.renderBubbleContent()}
              <View
                style={[
                  styles[position].bottom,
                  bottomContainerStyle && bottomContainerStyle[position],
                ]}>
                <View
                  style={{
                    flexDirection: position === 'left' ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  {this.renderTime()}
                  {this.renderTicks()}
                </View>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: position === 'left'? 0 : null,
                  left: position === 'right' ? 0 : null

                  // [position]: 0
                }}>
                {this.renderTokenCount()}
              </View>
            </View>

            </TouchableWithoutFeedback>
          </Animated.View>
        {this.renderQuickReplies()}
      </View>);
  }

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = {
  left: StyleSheet.create({
      container: {
      },
      wrapper: {
          borderRadius: 15,
          backgroundColor: Color.leftBubbleBackground,
          marginRight: 60,
          minHeight: 20,
          justifyContent: 'flex-end',
      minWidth: 100

      },
      tokenContainerStyle:{
        flexDirection:"row",
        marginRight:10,
        marginBottom: 5,
        justifyContent:"center",
        alignItems:"center",
      },
      tokenIconStyle:{
        height: hp("2%"),
        width: hp("2%")
      },
      tokenTextStyle:{
        color:Color.white,
        fontSize:  10,
        fontWeight:"bold",
        backgroundColor: 'transparent',
        textAlign: 'right',
      },
      containerToNext: {
          borderBottomLeftRadius: 3,
      },
      containerToPrevious: {
          borderTopLeftRadius: 3,
      },
      bottom: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
      },
  }),
  right: StyleSheet.create({
      container: {
          
      },
      wrapper: {
          borderRadius: 15,
          backgroundColor: Color.defaultBlue,
          marginLeft: 60,
          minHeight: 20,
          justifyContent: 'flex-end',
      minWidth: 100

      },
      containerToNext: {
        borderBottomRightRadius: 3,
      },
      tokenContainerStyle:{
        flexDirection:"row",
        marginLeft: 10,
        marginBottom: 5,
        justifyContent:"center",
        alignItems:"center",
      },
      tokenIconStyle:{
        height: hp("2%"),
        width: hp("2%")
      },
      tokenTextStyle:{
        color:Color.white,
        fontSize: 10,
        fontWeight:"bold",
        backgroundColor: 'transparent',
        textAlign: 'right',
      },
      containerToPrevious: {
          borderTopRightRadius: 3,
      },
      bottom: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
      },
  }),
  content: StyleSheet.create({
      tick: {
          fontSize: 10,
          backgroundColor: Color.backgroundTransparent,
          color: Color.white,
      },
      tickView: {
          flexDirection: 'row',
          marginRight: 10,
      },
      username: {
          top: -3,
          left: 0,
          fontSize: 12,
          backgroundColor: 'transparent',
          color: '#aaa',
      },
      usernameView: {
          flexDirection: 'row',
          marginHorizontal: 10,
      },
      userTextStyleLeft:{
        color:"#FFFF",
      },

  }),

};

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageVideo: null,
  renderMessageAudio: null,
  renderMessageText: null,
  renderCustomView: null,
  renderUsername: null,
  renderTicks: null,
  renderTime: null,
  renderQuickReplies: null,
  onQuickReply: null,
  position: 'left',
  // optionTitles: DEFAULT_OPTION_TITLES,
  currentMessage: {
      text: null,
      createdAt: null,
      image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  bottomContainerStyle: {},
  tickStyle: {},
  usernameStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};

Bubble.propTypes = {
  user: PropTypes.object.isRequired,
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageVideo: PropTypes.func,
    renderMessageAudio: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    isCustomViewBottom: PropTypes.bool,
    renderUsernameOnMessage: PropTypes.bool,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    renderQuickReplies: PropTypes.func,
    onQuickReply: PropTypes.func,
    position: PropTypes.oneOf(['left', 'right']),
    optionTitles: PropTypes.arrayOf(PropTypes.string),
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    wrapperStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    bottomContainerStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    tickStyle: StylePropType,
    usernameStyle: StylePropType,
    containerToNextStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: StylePropType,
        right: StylePropType,
    }),
};
