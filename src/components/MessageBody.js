import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  ViewPropTypes,
  StyleSheet,
  Text,
  ImageBackground
} from 'react-native';

import { Avatar, Day, utils, SystemMessage } from 'react-native-gifted-chat';
import Bubble from './MessageBubble';

const { isSameUser, isSameDay } = utils;

export default class Message extends React.Component {

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      isSameUser,
      isSameDay,
      containerStyle
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
    const { containerStyle, ...props } = this.props;
        if (this.props.renderBubble) {
            return this.props.renderBubble(props);
        }
        // @ts-ignore
        return <Bubble {...props}/>;
  }

  renderAvatar() {
    const { user, currentMessage, showUserAvatar } = this.props;
    if (user &&
        user._id &&
        currentMessage &&
        currentMessage.user &&
        user._id === currentMessage.user._id &&
        !showUserAvatar) {
        return null;
    }
    if (currentMessage &&
        currentMessage.user &&
        currentMessage.user.avatar === null) {
        return null;
    }
    const { containerStyle, ...props } = this.props;
    return <Avatar {...props}/>;
  }

  renderSystemMessage() {
    const { containerStyle, ...props } = this.props;
    if (this.props.renderSystemMessage) {
        return this.props.renderSystemMessage(props);
    }
    return <SystemMessage {...props}/>;
  }

  render() {
    const { currentMessage, nextMessage, position, containerStyle } = this.props;
        if (currentMessage) {
            const sameUser = isSameUser(currentMessage, nextMessage);
            return (<View>
          {this.renderDay()}
          {currentMessage.system ? (this.renderSystemMessage()) : (<View style={[
                styles[position].container,
                { marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                containerStyle && containerStyle[position],
            ]}>
              {this.props.position === 'left' ? this.renderAvatar() : null}
              {this.renderBubble()}
              {this.props.position === 'right' ? this.renderAvatar() : null}
            </View>)}
        </View>);
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
      },
  }),
  right: StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          marginLeft: 0,
          marginRight: 8,
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