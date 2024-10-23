import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { View, ViewPropTypes, StyleSheet } from "react-native";
import { Avatar, Day, utils, SystemMessage } from "react-native-gifted-chat";
import { textStyles } from "../../../docs/config";
import Bubble from "./MessageBubble";
const { isSameUser, isSameDay } = utils;
const Message = (props) => {
  const {
    currentMessage,
    nextMessage,
    previousMessage,
    renderBubble,
    renderDay,
    renderSystemMessage,
    position,
    containerStyle,
    inverted,
  } = props;
  const shouldRender = useMemo(() => {
    const next = currentMessage;
    const current = previousMessage;
    if (next.tokenAmount !== current.tokenAmount) return true;
    if (next.numberOfReplies !== current.numberOfReplies) return true;
    if (next.text !== current.text) return true;
    return false;
  }, [currentMessage, previousMessage]);
  const getInnerComponentProps = () => {
    const { containerStyle, ...rest } = props;
    return {
      ...rest,
      isSameUser,
      isSameDay,
      containerStyle,
    };
  };
  const renderDayComponent = () => {
    if (currentMessage.createdAt) {
      const dayProps = getInnerComponentProps();
      if (renderDay) {
        return renderDay(dayProps);
      }
      return <Day {...dayProps} containerStyle={{ paddingVertical: 12 }} />;
    }
    return null;
  };
  const renderBubbleComponent = () => {
    const { containerStyle, ...rest } = props;
    if (renderBubble) {
      return renderBubble(rest);
    }
    return (
      <Bubble
        usernameStyle={{ fontFamily: textStyles.regularFont }}
        {...rest}
      />
    );
  };
  const renderAvatarComponent = () => {
    const { containerStyle, ...rest } = props;
    return (
      <View accessibilityLabel="User photo (tap to view profile)">
        <Avatar {...rest} />
      </View>
    );
  };
  const renderSystemMessageComponent = () => {
    const { containerStyle, ...rest } = props;
    if (renderSystemMessage) {
      return renderSystemMessage(rest);
    }
    return <SystemMessage {...rest} textStyle={{ textAlign: "center" }} />;
  };
  if (!shouldRender) {
    return null;
  }
  if (currentMessage) {
    return (
      <View accessibilityLabel="Message (long tap to interact)">
        {renderDayComponent()}
        {currentMessage.system ? (
          renderSystemMessageComponent()
        ) : (
          <View
            style={[
              styles[position].container,
              { marginBottom: 8 },
              !inverted && { marginBottom: 2 },
              containerStyle && containerStyle[position],
            ]}
          >
            {position === "left" ? renderAvatarComponent() : null}
            {renderBubbleComponent()}
          </View>
        )}
      </View>
    );
  }
  return null;
};
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
};
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
export default Message;
