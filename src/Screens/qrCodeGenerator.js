import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import RNFS from "react-native-fs";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {commonColors, textStyles} from '../../docs/config';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import { CONFERENCEDOMAIN } from '../constants/xmppConstants';
import { unv_url } from '../../docs/config';

const {primaryColor} = commonColors;
const {mediumFont} = textStyles;

// const obj
class App extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      // Default Value of the TextInput
      valueForQRCode: '',
      // Default value for the QR Code
    };
    // obj = this
  }
  getTextInputValue = () => {
    // Function to get the value from input
    // and Setting the value to the QRCode
    this.setState({ valueForQRCode: this.state.inputValue });
  };
  shareQR = () => {
    this.svg.toDataURL(this.callback);
  }
  callback=(dataURL) =>{
    let imgURL = `data:image/png;base64,${dataURL}`
    Share.open({url:imgURL}).then(()=>{
      this.props.close()
    });
  }

  saveQrToDisk() {
    this.svg.toDataURL((data) => {
      RNFS.writeFile(RNFS.CachesDirectoryPath+"/some-name.png", data, 'base64')
        .then((success) => {
          Share.open(RNFS.CachesDirectoryPath+"/some-name.png");
        })
        .then(() => {
          this.setState({ busy: false, imageSaved: true });
          ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT);
        })
    })
  }

  createShareLink(){
    const roomName = this.props.value.replace(CONFERENCEDOMAIN,'');
    const chatLink = `${unv_url}${roomName}`
    return chatLink
  }

  copyToClipboard = async() => {
    const roomName = this.props.value.replace(CONFERENCEDOMAIN,'')
    const chatLink = `${unv_url}${roomName}`
    Clipboard.setString(chatLink);
    Toast.show('Link Copied');
  };

  render() {
    const qrlink = this.createShareLink();
    return (
      <View 
      style={styles.MainContainer}
      >
        <QRCode
          getRef={(c) => (this.svg = c)}
          //QR code value
          value={qrlink}
          //size of QR Code
          size={hp("20%")}
          //Color of the QR Code (Optional)
          color="black"
          quietZone = "5"
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
          onPress={this.shareQR}
          activeOpacity={0.7}
          style={styles.button}>
          <Text style={styles.TextStyle}> Share </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.copyToClipboard}
          activeOpacity={0.7}
          style={styles.button}>
          <Text style={styles.TextStyle}> Copy Link </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default App;
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
  },
  TextInputStyle: {
    width: '100%',
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingTop: 8,
    marginTop: 10,
    paddingBottom: 8,
    backgroundColor: primaryColor,
    marginBottom: 20,
    alignItems:'center'
  },
  TextStyle: {
    color: '#fff',
    fontFamily:mediumFont,
    // textAlign: 'center',
    fontSize: 18,
  },
});