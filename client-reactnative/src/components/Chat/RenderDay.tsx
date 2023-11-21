import * as React from "react"
import { Text, View, StyleSheet } from "react-native"
import dayjs from "dayjs"
import { isSameDay } from "react-native-gifted-chat/lib/utils"

interface RenderDayProps {
  currentMessage: any
  previousMessage: any
}

const RenderDay = (props: RenderDayProps) => {
  const { createdAt } = props.currentMessage
  if (
    props.currentMessage == null ||
    isSameDay(props.currentMessage, props.previousMessage)
  ) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text>{dayjs(createdAt).locale("en").format("ll")}</Text>
    </View>
  )
}

export default RenderDay

const styles = StyleSheet.create({
  container: {},
})
