import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { commonColors } from '../../../../docs/config';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

interface SendItemProps {
    displayItems:any,

}

const SendItem = (props: SendItemProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.displayItems();
      }}>
      <View style={styles.sendItemAndDMContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <FontistoIcon name="arrow-swap" size={15} color="black" />
        </View>
        <Text>Send Items</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SendItem;

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
