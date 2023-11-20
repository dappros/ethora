/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React, { useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native"
import Slider from "react-native-slider"
import AudioRecorderPlayer from "react-native-audio-recorder-player"
import PlayButton from "./PlayButton"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import { commonColors, textStyles } from "../../../docs/config"
import { heightPercentageToDP } from "react-native-responsive-screen"
const { primaryColor } = commonColors

export default function AudioPlayer({
  audioUrl,
  closePlayer,
}: {
  audioUrl: any
  closePlayer: () => void
}) {
  const [isAlreadyPlay, setisAlreadyPlay] = useState(false)
  const [duration, setDuration] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [percent, setPercent] = useState(0)
  const [audioRecorderPlayer, setAudioRecordedPlayer] = useState(
    new AudioRecorderPlayer()
  )

  const changeTime = async (seconds: any) => {
    // 50 / duration
    const seektime = (seconds / 100) * duration
    setTimeElapsed(seektime)
    audioRecorderPlayer.seekToPlayer(seektime)
  }
  const onStartPress = async () => {
    setisAlreadyPlay(true)
    audioRecorderPlayer.startPlayer(audioUrl)
    audioRecorderPlayer.setVolume(1.0)

    audioRecorderPlayer.addPlayBackListener(async (e) => {
      if (e.currentPosition === e.duration) {
        audioRecorderPlayer.stopPlayer()
        setisAlreadyPlay(false)
      }
      const currentPresent = Math.round(
        (Math.floor(e.currentPosition) / Math.floor(e.duration)) * 100
      )
      setTimeElapsed(e.currentPosition)
      setPercent(currentPresent)
      setDuration(e.duration)
    })
  }

  useEffect(() => {
    onStartPress()
    return () => {
      audioRecorderPlayer.stopPlayer()
      audioRecorderPlayer.removePlayBackListener()
    }
  }, [audioUrl])

  const onPausePress = async () => {
    setisAlreadyPlay(false)
    audioRecorderPlayer.pausePlayer()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {!isAlreadyPlay ? (
          <PlayButton onPress={() => onStartPress()} state="play" />
        ) : (
          <PlayButton onPress={() => onPausePress()} state="pause" />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <View style={styles.seekbar}>
          <Slider
            minimumValue={0}
            maximumValue={100}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            minimumTrackTintColor={commonColors.primaryDarkColor}
            onValueChange={(seconds: any) => changeTime(seconds)}
            value={percent}
          />

          <View style={styles.inprogress}>
            <Text style={[styles.textLight, styles.timeStamp]}>
              {audioRecorderPlayer.mmssss(Math.floor(timeElapsed))}
            </Text>
            <Text style={[styles.textLight, styles.timeStamp]}>
              {audioRecorderPlayer.mmssss(Math.floor(duration))}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={closePlayer} style={{ marginLeft: "auto" }}>
          <MaterialIcons name="close" color={"white"} size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: primaryColor,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  textLight: {
    color: "rgba(255,255,255,1)",
  },
  text: {
    color: "#8E97A6",
  },
  textDark: {
    color: "rgba(255,255,255,1)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  coverContainer: {
    shadowColor: "#5D3F6A",
    shadowOffset: { height: 15, width: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
  },

  track: {
    width: "100%",
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFF",
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: commonColors.primaryDarkColor,
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: "500",
  },
  seekbar: { width: "80%", marginRight: 0, marginHorizontal: 16 },
  inprogress: {
    marginTop: -12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackname: { alignItems: "center", marginTop: 32 },
})
