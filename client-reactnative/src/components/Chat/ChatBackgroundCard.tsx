import { Box, Pressable } from "native-base"
import * as React from "react"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { commonColors } from "../../../docs/config"
import AntDesign from "react-native-vector-icons/AntDesign"
import FastImage from "react-native-fast-image"

interface ChatBackgroundCardProps {
  value?: string
  alt?: string
  isSelected?: boolean
  onSelect: any
  index: number
}

const ChatBackgroundCard = (props: ChatBackgroundCardProps) => {
  return (
    <Pressable
      justifyContent={"center"}
      alignItems={"center"}
      onPress={() => props.onSelect(props.index)}
    >
      <Box
        borderWidth={props.isSelected ? 2 : 0}
        borderColor={props.isSelected ? commonColors.primaryDarkColor : null}
        opacity={props.isSelected ? 20 : 100}
        zIndex={-1}
        h={hp("40%")}
        w={hp("20%")}
        borderRadius={5}
        justifyContent="center"
        alignItems={"center"}
      >
        <FastImage
          style={{
            height: hp("40%"),
            width: hp("20%"),
            borderRadius: 5,
          }}
          source={{ uri: props.value }}
        />
      </Box>
      {props.isSelected ? (
        <AntDesign
          color={"black"}
          name="checkcircle"
          size={hp("3%")}
          style={{ position: "absolute", zIndex: 1 }}
        />
      ) : null}
    </Pressable>
  )
}

export default ChatBackgroundCard
