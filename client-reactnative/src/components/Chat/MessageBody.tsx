/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import PropTypes from "prop-types"
import React from "react"
import { View, ViewPropTypes, StyleSheet } from "react-native"

import { Avatar, Day, utils, SystemMessage } from "react-native-gifted-chat"
import { textStyles } from "../../../docs/config"
import Bubble from "./MessageBubble"

const { isSameUser, isSameDay } = utils
export default class Message extends React.Component {
  shouldComponentUpdate(nextProps) {
    const next = nextProps.currentMessage
    const current = this.props.currentMessage

    const nextPropsPreviousMessage = nextProps.previousMessage
    if (next.tokenAmount !== current.tokenAmount) return true

    if (next.numberOfReplies !== current.numberOfReplies) return true

    if (next.text !== current.text) return true

    return false
  }
  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props
    return {
      ...props,
      isSameUser,
      isSameDay,
      containerStyle,
    }
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps()
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps)
      }
      return <Day {...dayProps} />
    }
    return null
  }

  renderBubble() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderBubble) {
      return this.props.renderBubble(props)
    }
    // @ts-ignore
    return (
      <Bubble
        usernameStyle={{ fontFamily: textStyles.regularFont }}
        {...props}
      />
    )
  }

  renderAvatar() {
    const { containerStyle, ...props } = this.props
    return (
      <View accessibilityLabel="User photo (tap to view profile)">
        <Avatar {...props} />
      </View>
    )
  }

  renderSystemMessage() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(props)
    }
    return <SystemMessage {...props} textStyle={{ textAlign: "center" }} />
  }

  render() {
    const { currentMessage, nextMessage, position, containerStyle } = this.props
    if (currentMessage) {
      const sameUser = isSameUser(currentMessage, nextMessage)
      return (
        <View accessibilityLabel="Message (long tap to interact)">
          {this.renderDay()}
          {currentMessage.system ? (
            this.renderSystemMessage()
          ) : (
            <View
              style={[
                styles[position].container,
                { marginBottom: sameUser ? 2 : 10 },
                !this.props.inverted && { marginBottom: 2 },
                containerStyle && containerStyle[position],
              ]}
            >
              {this.props.position === "left" ? this.renderAvatar() : null}
              {this.renderBubble()}
              {this.props.position === "right" ? this.renderAvatar() : null}
            </View>
          )}
        </View>
      )
    }
    return null
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-start",
      marginLeft: 8,
      marginRight: 0,
      fontFamily: textStyles.regularFont,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      marginLeft: 0,
      marginRight: 8,
      fontFamily: textStyles.regularFont,
    },
  }),
}

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  renderSystemMessage: null,
  position: "left",
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  showUserAvatar: false,
  inverted: true,
  shouldUpdateMessage: undefined,
}

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
}
