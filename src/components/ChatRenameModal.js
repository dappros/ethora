import React, {useState} from 'react';
import {Text} from 'react-native';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {CommonTextInput} from './shared/customTextInputs';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {commonColors, textStyles} from '../../docs/config';
const {primaryColor, primaryDarkColor} = commonColors;
const {lightFont} = textStyles;

export const ChatRenameModal = ({
  modalVisible,
  onBackdropPress,
  onSubmit,
  pickedJid,
  previousInputValue
}) => {
  const [inputValue, setInputValue] = useState(previousInputValue);
  const onChange = text => {
    setInputValue(text);
  };
  const submit = () => {
    onSubmit(inputValue, pickedJid);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      isVisible={modalVisible}
      onBackdropPress={onBackdropPress}>
      <View style={chatHomeStyles.modalContainer}>
        <CommonTextInput
          maxLength={128}
          containerStyle={chatHomeStyles.modalInput}
          fontsStyle={chatHomeStyles.modalInputText}
          value={inputValue}
          onChangeText={text => onChange(text)}
          placeholder="Enter new chat name"
          placeholderTextColor={primaryColor}
        />

        <TouchableOpacity onPress={submit} style={chatHomeStyles.modalButton}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <Text style={{color: 'white'}}>Done editing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const chatHomeStyles = StyleSheet.create({
  swipeActionItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    // borderRadius: 4
  },
  chatHomeItemParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    shadowOffset: {width: -1, height: 1},
    shadowColor: primaryColor,
    shadowOpacity: 1.0,
    borderWidth: 1,
    borderColor: 'white',
    shadowRadius: 1,
    backgroundColor: 'white',

    height: 20,
    width: 40,
  },
  chatHomeItemIcon: {
    borderWidth: 1,
    borderColor: primaryDarkColor,
    backgroundColor: primaryDarkColor,
    height: hp('5.54%'),
    width: hp('5.54%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
    borderRadius: hp('0.7%'),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 20,
  },
  modalInput: {
    borderWidth: 0.5,
    // borderTopWidth: 0,
    borderColor: primaryColor,
    backgroundColor: 'white',
    width: wp('81%'),
    height: hp('6.8%'),
    // padding: hp('2.4'),
    paddingLeft: wp('3.73'),
    borderRadius: 0,
    marginBottom: 10,
    // marginTop: 10
  },
  modalButton: {
    backgroundColor: primaryColor,
    borderRadius: 5,
    height: hp('4.3'),
    padding: 4,
  },
  modalInputText: {
    fontFamily: lightFont,
    fontSize: hp('1.6%'),
    color: 'black',
  },
});
