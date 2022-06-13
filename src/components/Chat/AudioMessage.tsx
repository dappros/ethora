import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import {commonColors} from '../../../docs/config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {HStack} from 'native-base';

export const AudioMessage = ({onLongPress, onPress, waveform, message}) => {
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress('', message.currentMessage)}
      onPress={() => onPress(message)}
      activeOpacity={0.7}
      style={styles.button}>
      <HStack
        alignItems={'center'}
        style={{
          marginTop: 10,
        }}>
        <AntDesign
          name="play"
          size={hp('3%')}
          color={'white'}
          style={{
            marginRight: 4,
            marginLeft: 10,
          }}
        />
        {!!waveform && (
          <Svg stroke={commonColors.primaryDarkColor} width={100} height={55}>
            {waveform.map((item, i) => (
              <Rect
                fill={'rgba(255,255,255,0.9)'}
                key={i}
                width={3}
                x={i * 4}
                y={35 + item}
                height={item === 0 ? -3 : -item * 25}
              />
            ))}
          </Svg>
        )}
      </HStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    height: hp('5%'),
    justifyContent: 'center',
    position: 'relative',
  },
});
