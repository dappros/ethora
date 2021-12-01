import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from '../../Screens/style/chatHomeStyle';

export const ChatEmptyComponent = ({navigation}) => {
  return (
    <View style={styles.emptyChatContainer}>
      <View>
        <Image source={require('../../assets/chatEmpty.png')} />
      </View>
      <View
        style={{
          justifyContent: 'center',
          margin: 5,
        }}>
        <Text style={styles.noChatText}>No chats found</Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          margin: 5,
        }}>
        <Text style={styles.descText}>
          You can start by creating new chats orjoin existing chats
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 20,
        }}>
        {/* Button to create new chat qrcode */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateNewChatComponent')}
          style={styles.button1Container}>
          <Text style={styles.button1}>Create new</Text>
        </TouchableOpacity>

        {/* Button to scan a chat qrcode */}
        <TouchableOpacity
          onPress={() => navigation.navigate('QRScreenComponent')}
          style={styles.button2Container}>
          <Text style={styles.button2}>Scan QR to join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
