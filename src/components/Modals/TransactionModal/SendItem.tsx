import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {commonColors} from '../../../../docs/config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { Pressable } from 'native-base';

interface SendItemProps {
  onPress: () => void;
}

const SendItem = ({onPress}: SendItemProps) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.sendItemAndDMContainer}>
        <View style={styles.sendItemAndDMIconContainer}>
          <FontistoIcon name="arrow-swap" size={15} color="black" />
        </View>
        <Text style={{color: 'black'}}>Send Items</Text>
      </View>
    </Pressable>
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
