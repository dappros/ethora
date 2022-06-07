import * as React from 'react';
import {StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { commonColors } from '../../../../docs/config';
import { Text, View } from 'native-base';

interface DirectMessageProps {
    onPress:any
}

const DirectMessage = (props: DirectMessageProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}>
      <View style={styles.sendItemAndDMContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <FontAwesome name="send" size={15} color="black" />
        </View>
        <Text>Direct Message</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DirectMessage;

const styles = StyleSheet.create({
    sendItemAndDMContainer: {
        width: wp('50%'),
        height: hp('5%'),
        borderRadius: hp('1%'),
        borderWidth: 1,
        borderColor: commonColors.primaryColor,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendItemAndDMIconContainer: {
        position: 'absolute',
        left: 10,
    },
});
