import React, {Component, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {commonColors, textStyles, unv_url} from '../../docs/config';
import Clipboard from '@react-native-clipboard/clipboard';
import { useStores } from '../stores/context';
import { showToast } from './Toast/toast';
// import Toast from 'react-native-simple-toast';
// import {unv_url} from '../../docs/config';
// import {connect} from 'react-redux';
// import { showInfo } from '../config/toastAction';


interface QRCodeGeneratorProps {
    shareKey:string,
    close:any
}


const QRCodeGenerator = (props: QRCodeGeneratorProps) => {
    const svg = useRef(null);
    const {apiStore} = useStores();
    const {shareKey} = props

    let link = ""

    if(props.shareKey.includes('profileLink')){
      link = shareKey
    }else{
       link = props.shareKey.replace(
        apiStore.xmppDomains.CONFERENCEDOMAIN,
        '',
      );
    }
    const createShareLink=()=> {
        const shareLink = `${unv_url}${link}`;
        return shareLink;
    }

    const shareQR = () => {
        svg.current.toDataURL(callback)
    }

    const callback = (dataURL:string) => {
        let imgURL = `data:image/png;base64,${dataURL}`;
        Share.open({url: imgURL}).then(() => {
          props.close();
        });
    }

    const copyToClipboard = () => {
        const shareLink = `${unv_url}${link}`;
        Clipboard.setString(shareLink);
        showToast('success', 'Info', 'Link copied', 'top')
        // showInfo('Info', 'Link copied.')
    };

  const qrlink = createShareLink();

  return (
    <View style={styles.MainContainer}>
    <QRCode
      getRef={svg}
      //QR code value
      value={qrlink}
      //size of QR Code
      size={hp('20%')}
      //Color of the QR Code (Optional)
      color="black"
      quietZone={5}
      //Background Color of the QR Code (Optional)
      backgroundColor="white"
      //Logo of in the center of QR Code (Optional)
      // logo={logoPath}
      //Center Logo size  (Optional)
      logoSize={30}
      //Center Logo margin (Optional)
      logoMargin={1}
      //Center Logo radius (Optional)
      //Center Logo background (Optional)
      logoBackgroundColor="white"
    />
    <TouchableOpacity
      onPress={shareQR}
      activeOpacity={0.7}
      style={styles.button}>
      <Text style={styles.TextStyle}> Share </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={copyToClipboard}
      activeOpacity={0.7}
      style={styles.button}>
      <Text style={styles.TextStyle}> Copy Link </Text>
    </TouchableOpacity>
  </View>
  );
};

export default QRCodeGenerator;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '100%',
        paddingTop: 8,
        marginTop: 10,
        paddingBottom: 8,
        backgroundColor: commonColors.primaryColor,
        marginBottom: 20,
        alignItems: 'center',
    },
    TextStyle: {
        color: '#fff',
        fontFamily: textStyles.mediumFont,
        // textAlign: 'center',
        fontSize: 18,
    },
});
