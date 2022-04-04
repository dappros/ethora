import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {commonColors, textStyles} from '../../docs/config';
import {imageMimetypes} from '../constants/mimetypes';
import AntIcon from 'react-native-vector-icons/AntDesign';

export const NftListItem = ({
  image,
  assetsYouHave,
  totalAssets,
  name,
  onClick,
  nftId,
  index,
  item,
  mimetype,
  itemSelected,
}) => {
  console.log(itemSelected);
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View
        onPress={onClick}
        style={[
          styles.container,
          {backgroundColor: itemSelected ? 'rgba(0,0,0,0.15)' : '#F4F5F8'},
        ]}>
        <View style={styles.justifyAround}>
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              {imageMimetypes[mimetype] ? (
                <Image
                  style={styles.image}
                  source={{
                    uri: image,
                  }}
                />
              ) : (
                <AntIcon
                  name={'playcircleo'}
                  color={commonColors.primaryColor}
                  size={hp('5%')}
                />
              )}
            </View>
            <View style={{width: wp('70%')}}>
              <Text style={styles.itemName}>{name}</Text>
            </View>
          </View>
          <View style={styles.itemCount}>
            <Text>
              {assetsYouHave}/{totalAssets}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    height: hp('8.62%'),
    width: '100%',
    // backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
    backgroundColor: '#F4F5F8',

    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: null,
  },
  justifyAround: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  itemContainer: {
    width: wp('100%'),

    // backgroundColor: '#F4F5F8',
    flexDirection: 'row',
    alignItems: 'center',

    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: wp('24%'),
    // flex: 0.24,
    // marginLeft: wp('13%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    fontFamily: textStyles.regularFont,
    fontSize: hp('2.2%'),
    color: '#000000',
    marginLeft: 20,
    // alignSelf: 'left'
  },
  itemCount: {
    // backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
});
