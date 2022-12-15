import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import parseChatLink from '../helpers/parseChatLink';
import {useStores} from '../stores/context';
import {underscoreManipulation} from '../helpers/underscoreLogic';
import openChatFromChatLink from '../helpers/chat/openChatFromChatLink';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {PNG} from 'pngjs/browser';
import JpegDecoder from 'jpeg-js';
import jsQR from 'jsqr';
import {retrieveOtherUserVcard, subscribeToRoom} from '../xmpp/stanzas';
import {ROUTES} from '../constants/routes';
import {commonColors, textStyles} from '../../docs/config';
import {CONFERENCEDOMAIN} from '../xmpp/xmppConstants';
import {showToast} from '../components/Toast/toast';
const Buffer = require('buffer').Buffer;
global.Buffer = Buffer; // very important

const options = {
  mediaType: 'photo',
  includeBase64: true,
  maxHeight: 200,
  maxWidth: 200,
};

function createImageData(base64ImageData: any, imageType: string) {
  let decodedData: any = {};
  const bufferFrom = Buffer.from(base64ImageData, 'base64');
  if (imageType === 'image/jpeg') {
    decodedData = JpegDecoder.decode(bufferFrom, {useTArray: true});
  } else if (imageType === 'image/png') {
    decodedData = PNG.sync.read(bufferFrom);
  }
  return jsQR(
    Uint8ClampedArray.from(decodedData.data),
    decodedData.width,
    decodedData.height,
  );
}

interface ScanScreenProps {}

const ScanScreen = (props: ScanScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scan, setScan] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const [result, setResult] = useState(null);

  const {loginStore, chatStore, apiStore} = useStores();

  const manipulatedWalletAddress = underscoreManipulation(
    loginStore.initialData.walletAddress,
  );
  const username = loginStore.initialData.username;

  const navigation = useNavigation();

  const onSuccess = (e: any) => {
    if (!e) {
      showToast('error', 'Error', 'Invalid QR', 'top');
      setIsLoading(false);
      return;
    }
    if (e.data.includes('profileLink')) {
      const params = e.data.split('https://www.eto.li/go')[1];
      const queryParams = new URLSearchParams(params);
      const firstName: string = queryParams.get('firstName');
      const lastName: string = queryParams.get('lastName');
      const xmppId: string = queryParams.get('xmppId');
      const walletAddressFromLink: string = queryParams.get('walletAddress');

      if (loginStore.initialData.walletAddress === walletAddressFromLink) {
        navigation.navigate(ROUTES.PROFILE);
      } else {
        retrieveOtherUserVcard(
          loginStore.initialData.xmppUsername,
          xmppId,
          chatStore.xmpp,
        );

        loginStore.setOtherUserDetails({
          anotherUserFirstname: firstName,
          anotherUserLastname: lastName,
          anotherUserLastSeen: {},
          anotherUserWalletAddress: walletAddressFromLink,
        });
        navigation.navigate(ROUTES.OTHERUSERPROFILESCREEN);
      }
    } else {
      // const jid = parseChatLink(e.data) + CONFERENCEDOMAIN;
      // setResult(jid);
      // setScan(false);
      // setScanResult(true);
      // subscribeToRoom(jid, manipulatedWalletAddress, chatStore.xmpp);
      // navigation.navigate(ROUTES.CHAT, {
      //   chatJid: jid,
      //   // chatName: 'Loading...',
      // });

      if (e) {
        const jid = parseChatLink(e.data);

        if (jid) {
          subscribeToRoom(
            jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
            manipulatedWalletAddress,
            chatStore.xmpp,
          );
          setIsLoading(false);
          navigation.navigate(ROUTES.CHAT, {
            chatJid: jid + apiStore.xmppDomains.CONFERENCEDOMAIN,
            // chatName: 'Loading...',
          });
        } else {
          showToast('error', 'Error', 'Invalid QR', 'top');
          setIsLoading(false);
        }
      } else {
        showToast('error', 'Error', 'Invalid QR', 'top');
        setIsLoading(false);
      }
    }
  };

  const openGallery = () => {
    setIsLoading(true);
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        setIsLoading(false);
        console.log('User cancelled image picker');
      } else if (response.error) {
        setIsLoading(false);
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        setIsLoading(false);
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const res = createImageData(
          response.assets[0].base64,
          response.assets[0].type,
        );
        console.log(JSON.stringify(res));
        onSuccess(res);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{zIndex: Platform.OS === 'android' ? +1 : 0, flex: 0.2}}>
        <SecondaryHeader title="Scan" />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={'black'} animating={isLoading} />
      ) : (
        <QRCodeScanner
          showMarker={true}
          topViewStyle={{flex: 0}}
          containerStyle={{flex: 1}}
          cameraStyle={{
            flex: Platform.OS === 'android' ? 0.8 : 1,
            height: hp('40%'),
            width: '100%',
            justifyContent: 'flex-start',
          }}
          bottomViewStyle={{flex: 1}}
          onRead={e => onSuccess(e)}
          bottomContent={
            <TouchableOpacity
              onPress={openGallery}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonTextStyle}>Upload from gallery.</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:"center"
  },
  buttonTouchable: {
    fontSize: 21,
    backgroundColor: commonColors.primaryColor,
    marginTop: 32,
    borderRadius: 5,
    width: wp('53.33%'),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('6.03%'),
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontFamily: textStyles.regularFont,
  },
});
