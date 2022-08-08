/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';

import {Avatar, Day, utils, SystemMessage} from 'react-native-gifted-chat';
import { textStyles } from '../../../docs/config';
import Bubble from './MessageBubble';

const {isSameUser, isSameDay} = utils;

export default class Message extends React.Component {

  shouldComponentUpdate(nextProps) {
    const next = nextProps.currentMessage;
    const current = this.props.currentMessage;
    const { previousMessage, nextMessage } = this.props;
    const nextPropsMessage = nextProps.nextMessage;
    const nextPropsPreviousMessage = nextProps.previousMessage;
    const shouldUpdate = (this.props.shouldUpdateMessage &&
        this.props.shouldUpdateMessage(this.props, nextProps)) ||
        false;
    return (next.sent !== current.sent ||
        next.received !== current.received ||
        next.pending !== current.pending ||
        next.createdAt !== current.createdAt ||
        next.text !== current.text ||
        next.image !== current.image ||
        next.video !== current.video ||
        next.audio !== current.audio ||
        previousMessage !== nextPropsPreviousMessage ||
        nextMessage !== nextPropsMessage ||
        shouldUpdate);
  }

  getInnerComponentProps() {
    const {containerStyle, ...props} = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay,
      containerStyle,
    };
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps();
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  }

  renderBubble() {
    const {containerStyle, ...props} = this.props;
    if (this.props.renderBubble) {
      return this.props.renderBubble(props);
    }
    // @ts-ignore
    return <Bubble
    // containerToNextStyle={{
    //  left: {
    //   borderBottomLeftRadius:3
    //  },
    //  right:{
    //   borderBottomRightRadius:3
    //  }
    // }}
    // containerToPrevious={{
    //   left: {
    //     borderTopLeftRadius:3,
    //     borderTopRightRadius:15
    //    },
    //   //  right:{
    //   //   borderTopRightRadius:3
    //   //  }
    // }}
    usernameStyle={{fontFamily:textStyles.regularFont}} {...props} />;
  }

  renderAvatar() {
    const {user, currentMessage, showUserAvatar} = this.props;
    if (
      user &&
      user._id &&
      currentMessage &&
      currentMessage.user &&
      user._id === currentMessage.user._id &&
      !showUserAvatar
    ) {
      return null;
    }
    if (
      currentMessage &&
      currentMessage.user &&
      currentMessage.user.avatar === null
    ) {
      return null;
    }
    const {containerStyle, ...props} = this.props;
    return <Avatar {...props} />;
  }

  renderSystemMessage() {
    const {containerStyle, ...props} = this.props;
    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(props);
    }
    return <SystemMessage {...props} textStyle={{textAlign: 'center'}} />;
  }

  render() {
    const {currentMessage, nextMessage, position, containerStyle} = this.props;
    if (currentMessage) {
      const sameUser = isSameUser(currentMessage, nextMessage);
      return (
        <View>
          {this.renderDay()}
          {currentMessage.system ? (
            this.renderSystemMessage()
          ) : (
            <View
              style={[
                styles[position].container,
                {marginBottom: sameUser ? 2 : 10},
                !this.props.inverted && {marginBottom: 2},
                containerStyle && containerStyle[position],
              ]}>
              {this.props.position === 'left' ? this.renderAvatar() : null}
              {this.renderBubble()}
              {this.props.position === 'right' ? this.renderAvatar() : null}
            </View>
          )}
        </View>
      );
    }
    return null;
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
      fontFamily:textStyles.regularFont
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
      fontFamily:textStyles.regularFont
    },
  }),
};

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  renderSystemMessage: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  showUserAvatar: false,
  inverted: true,
  shouldUpdateMessage: undefined,
};

Message.propTypes = {
  renderAvatar: PropTypes.func,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
