import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Slider from 'react-native-slider';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import PlayButton from './PlayButton';
import {commonColors, textStyles} from '../../../docs/config';
const {primaryColor} = commonColors;

export default function AudioPlayer({audioUrl}:{audioUrl:any}) {
  const [isAlreadyPlay, setisAlreadyPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [percent, setPercent] = useState(0);
  const [audioRecorderPlayer, setAudioRecordedPlayer] = useState(
    new AudioRecorderPlayer(),
  );

  const changeTime = async (seconds:any) => {
    // 50 / duration
    let seektime = (seconds / 100) * duration;
    setTimeElapsed(seektime);
    audioRecorderPlayer.seekToPlayer(seektime);
  };
  const onStartPress = async () => {
    setisAlreadyPlay(true);
    audioRecorderPlayer.startPlayer(audioUrl);
    audioRecorderPlayer.setVolume(1.0);

    audioRecorderPlayer.addPlayBackListener(async e => {
      if (e.currentPosition === e.duration) {
        audioRecorderPlayer.stopPlayer();
        setisAlreadyPlay(false);
      }
      let currentPresent = Math.round(
        (Math.floor(e.currentPosition) / Math.floor(e.duration)) * 100,
      );
      setTimeElapsed(e.currentPosition);
      setPercent(currentPresent);
      setDuration(e.duration);
    });
  };

  useEffect(() => {
    onStartPress();
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [audioUrl]);

  const onPausePress = async () => {

    setisAlreadyPlay(false);
    audioRecorderPlayer.pausePlayer();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {!isAlreadyPlay ? (
          <PlayButton onPress={() => onStartPress()} state="play" />
        ) : (
          <PlayButton onPress={() => onPausePress()} state="pause" />
        )}
      </View>
      <View style={styles.seekbar}>
        <Slider
          minimumValue={0}
          maximumValue={100}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          minimumTrackTintColor={commonColors.primaryDarkColor}
          onValueChange={(seconds:any) => changeTime(seconds)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: primaryColor,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  textLight: {
    color: 'rgba(255,255,255,1)',
  },
  text: {
    color: '#8E97A6',
  },
  textDark: {
    color: 'rgba(255,255,255,1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  coverContainer: {
    shadowColor: '#5D3F6A',
    shadowOffset: {height: 15},
    shadowRadius: 8,
    shadowOpacity: 0.3,
  },

  track: {
    width: '100%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFF',
  },
  thumb: {
    width: 8,
    height: 8,
    backgroundColor: commonColors.primaryDarkColor,
  },
  timeStamp: {
    fontSize: 11,
    fontWeight: '500',
  },
  seekbar: {margin: 32, width: '80%'},
  inprogress: {
    marginTop: -12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackname: {alignItems: 'center', marginTop: 32},
});