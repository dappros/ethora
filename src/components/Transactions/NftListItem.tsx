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
import {imageMimetypes, videoMimetypes} from '../../constants/mimeTypes';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {commonColors, textStyles} from '../../../docs/config';
import FastImage from 'react-native-fast-image';

interface NftListItemProps {
  assetUrl: string;
  assetsYouHave: string;
  totalAssets: string;
  name: string;
  onClick: any;
  nftId: string;
  index: number;
  item: any;
  mimetype: string;
  itemSelected: boolean;
  onAssetPress: () => void;
}

export const NftListItem = (props: NftListItemProps) => {
  const {
    assetUrl,
    assetsYouHave,
    totalAssets,
    name,
    onClick,
    nftId,
    index,
    item,
    mimetype,
    itemSelected,
    onAssetPress,
  } = props;
  return (
    <View
      onPress={onClick}
      style={[
        styles.container,
        {backgroundColor: itemSelected ? 'rgba(0,0,0,0.15)' : '#F4F5F8'},
      ]}>
      <View style={styles.justifyAround}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            {imageMimetypes[mimetype] || videoMimetypes[mimetype] ? (
              <TouchableWithoutFeedback onPress={onAssetPress}>
                <FastImage
                  style={styles.image}
                  source={{
                    // @ts-ignore
                    uri: assetUrl,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onPress={onAssetPress}>
                <AntIcon
                  name={'playcircleo'}
                  color={commonColors.primaryColor}
                  size={hp('5%')}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
          <TouchableWithoutFeedback
            onPress={onClick}
            style={{width: wp('70%'), height: '100%'}}>
            <View style={{width: wp('70%')}}>
              <Text style={styles.itemName}>{name}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableWithoutFeedback onPress={onClick}>
          <View style={styles.itemCount}>
            <Text style={{color: 'black'}}>
              {assetsYouHave}/{totalAssets}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
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
