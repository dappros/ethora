import {HStack, View} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {commonColors, textStyles} from '../../../docs/config';
import {
  audioMimetypes,
  imageMimetypes,
  pdfMimemtype,
  videoMimetypes,
} from '../../constants/mimeTypes';
import {IDocument} from '../../stores/walletStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntIcon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

export interface IDocumentListItem {
  item: IDocument;
  onAssetPress: () => void;
  onItemPress: () => void;
}

export const DocumentListItem: React.FC<IDocumentListItem> = ({
  onAssetPress,
  item,
  onItemPress,
}) => {
  return (
    <HStack
      style={styles.container}
      justifyContent={'space-between'}
      alignItems={'center'}>
      <HStack>
        <View style={styles.imageContainer}>
          {!!imageMimetypes[item.file.mimetype] ||
            !!videoMimetypes[item.file.mimetype] ||
            (!!pdfMimemtype[item.file.mimetype] && (
              <TouchableWithoutFeedback onPress={onAssetPress}>
                <FastImage
                  style={styles.image}
                  source={{
                    // @ts-ignore
                    uri: item.file.locationPreview,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </TouchableWithoutFeedback>
            ))}
          {audioMimetypes[item.file.mimetype] && (
            <TouchableWithoutFeedback onPress={onAssetPress}>
              <AntIcon
                name={'playcircleo'}
                color={commonColors.primaryColor}
                size={hp('5%')}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
        <View>
          <TouchableOpacity onPress={onItemPress}>
            <Text style={styles.itemName}> {item.documentName}</Text>
            <Text>{moment(item.createdAt).format('DD.MM.YYYY')}</Text>
          </TouchableOpacity>
        </View>
      </HStack>
      <View>
        <TouchableOpacity>
          <AntIcon name={'qrcode'} color={'black'} size={hp('5%')} />
        </TouchableOpacity>
      </View>
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp('8.62%'),
    width: '100%',
    // backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F4F5F8',
    backgroundColor: '#F4F5F8',
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
    // alignSelf: 'left'
  },
  itemCount: {
    // backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
  },
});
