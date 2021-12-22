import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {commonColors} from '../../docs/config';

export const FloatingActionButton = ({action, style, children}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={action}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: commonColors.primaryDarkColor,
    borderRadius: 100,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
});
