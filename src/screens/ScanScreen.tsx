import React, {useRef, useState} from 'react';
import { Text, View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import SecondaryHeader from '../components/SecondaryHeader/SecondaryHeader';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import parseChatLink from '../helpers/parseChatLink';
import { useStores } from '../stores/context';
import { underscoreManipulation } from '../helpers/underscoreLogic';
import openChatFromChatLink from '../helpers/openChatFromChatLink';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import {PNG} from 'pngjs/browser';
import JpegDecoder from 'jpeg-js';
import jsQR from 'jsqr';
import { getUserRoomsStanza, subscribeToRoom } from '../xmpp/stanzas';
import { ROUTES } from '../constants/routes';
import { commonColors, textStyles } from '../../docs/config';

const options = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 200,
    maxWidth: 200,
};

function createImageData(base64ImageData:any, imageType:string, callback:any) {
    let decodedData:any = {};
    const bufferFrom = Buffer.from(base64ImageData, 'base64');
    if (imageType === 'image/jpeg') {
      console.log('decoded jpeg');
      decodedData = JpegDecoder.decode(bufferFrom, {useTArray: true});
      console.log(decodedData.data, 'decoded jpeg');
    } else if (imageType === 'image/png') {
      decodedData = PNG.sync.read(bufferFrom);
      console.log(decodedData, 'decoded png');
    }
    const code = jsQR(
      Uint8ClampedArray.from(decodedData.data),
      decodedData.width,
      decodedData.height,
    );
    console.log(code, 'this is it');
    callback(code);
}

interface ScanScreenProps {}

const ScanScreen = (props: ScanScreenProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [scan, setScan] = useState(false);
    const [scanResult, setScanResult] = useState(false);
    const [result, setResult] = useState(null);

    const {loginStore, chatStore} = useStores();

    const manipulatedWalletAddress = underscoreManipulation(loginStore.initialData.walletAddress);
    const username = loginStore.initialData.username;

    const navigation = useNavigation()

    const onSuccess = (e:any) => {
        const chatJID = parseChatLink(e.data);
        setResult(chatJID);
        setScan(false);
        setScanResult(true)
        openChatFromChatLink(
          chatJID,
          loginStore.initialData.walletAddress,
          navigation,
          chatStore.xmpp,
        );
    };

    const openGallery=()=> {
        setIsLoading(true)
        launchImageLibrary(options, async response => {
          console.log('Response = ', response);
          if (response.didCancel) {
            setIsLoading(false)
            console.log('User cancelled image picker');
          } else if (response.error) {
            setIsLoading(false)
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            setIsLoading(false)
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const qrCodeFileUri = {uri: response.uri};
            createImageData(response.base64, response.type, res => {
              console.log(res, '234879234');
              // console.log(res.data,'returned data')
              if (res) {
                // this.openChat(res.data);
                subscribeToRoom(
                    res.data,
                    manipulatedWalletAddress,
                    chatStore.xmpp
                )
                getUserRoomsStanza(manipulatedWalletAddress,chatStore.xmpp)
                navigation.navigate(ROUTES.CHAT, {chatJid: res.data, chatName: "Loading..."});
              } else {
                alert('Invalid QR');
                setIsLoading(false)
              }
            });
            //   this.setState({
            //     avatarSource: source,
            //   });
          }
        });
      }

    return (
        <View style={styles.container}>
        <View style={{zIndex: Platform.OS === 'android' ? +1 : 0, flex: 0.2}}>
        <SecondaryHeader
            title='Scan'
        />
        </View>
        {/* <StatusBar barStyle="dark-content" /> */}
        {isLoading ? (
            <ActivityIndicator
            size="large"
            color={'black'}
            animating={isLoading}
            />
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
            bottomViewStyle={{flex: 0.2}}
            onRead={e => onSuccess(e)}
            bottomContent={
(                <TouchableOpacity
                    onPress={()=>alert('hi')}
                    style={styles.buttonTouchable}>
                    <Text style={styles.buttonTextStyle}>
                    Upload from gallery.
                    </Text>
                </TouchableOpacity>)
            }
            />
        )}
    </View>
    );
};

export default ScanScreen;

const styles = StyleSheet.create({
    container: {
        flex:1,
        // alignItems:"center"
    },
    buttonTouchable: {
        fontSize: 21,
        backgroundColor: commonColors.primaryColor,
        marginTop: 32,
        borderRadius:5,
        width: wp('53.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        height: hp('6.03%')
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        fontFamily: textStyles.regularFont,
    },
});
