/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { textStyles } from '../../../../docs/config';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface ReportAndBlockButtonProps {
    onPress:any,
    type:any
}

const ReportAndBlockButton = (props: ReportAndBlockButtonProps) => {
    const textLabel =
    props.type === '0' ? 'Report this message' : 'Ban this user';
    const iconName = props.type === '0' ? 'report-problem' : 'block';
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.reportAndBlockContainer}>
        <View style={styles.blockIcon}>
          <MaterialIcons name={iconName} size={15} color="#fff" />
        </View>
        <Text style={styles.reportAndBlockText}>{textLabel}</Text>
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
