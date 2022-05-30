import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function PlayButton(props) {
  return (
    <TouchableOpacity
      style={styles.playButtonContainer}
      onPress={props.onPress}>
      <FontAwesome name={props.state} size={25} color="black" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playButtonContainer: {
    // backgroundColor: '#000',
    borderColor: 'rgba(93, 63, 106, 0.2)',
    // borderWidth: 16,
    width: 30,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: 32,
    shadowColor: '#5D3F6A',
    // shadowRadius: 30,
    shadowOpacity: 0.5,
  },
});