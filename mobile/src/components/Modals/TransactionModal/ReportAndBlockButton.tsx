/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import * as React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {textStyles} from '../../../../docs/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface ReportAndBlockButtonProps {
  onPress: any;
  text: string;
  style?: any;
}

const ReportAndBlockButton = (props: ReportAndBlockButtonProps) => {
  const iconName = 'block';
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.reportAndBlockContainer, props.style]}>
        <View style={styles.blockIcon}>
          <MaterialIcons name={iconName} size={15} color="#fff" />
        </View>
        <Text style={styles.reportAndBlockText}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ReportAndBlockButton;

const styles = StyleSheet.create({
  reportAndBlockContainer: {
    width: wp('50%'),
    height: hp('5%'),
    borderRadius: hp('1%'),
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#B22222',
  },
  reportAndBlockText: {
    fontFamily: textStyles.semiBoldFont,
    color: '#fff',
  },
  blockIcon: {
    marginRight: 5,
  },
});
