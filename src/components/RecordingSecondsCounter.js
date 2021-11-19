import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Pulse from 'react-native-pulse';
import {commonColors} from '../../docs/config';

export function RecordingSecondsCounter() {
  const [miliseconds, setMiliseconds] = useState(0);
  const [audioRecorderPlayer, setAudioRecorderPlayer] = useState(
    new AudioRecorderPlayer(),
  );

  useEffect(() => {
    const timer = setInterval(() => setMiliseconds(prev => prev + 100), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text style={{color: commonColors.primaryColor}}>
        {audioRecorderPlayer.mmssss(Math.floor(miliseconds))}
      </Text>
      <View style={{marginLeft: 15}}>
        <Pulse
          color="red"
          numPulses={3}
          diameter={40}
          speed={1}
          duration={1000000}
        />
      </View>
    </View>
  );
}
