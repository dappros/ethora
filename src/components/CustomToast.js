import React from 'react';
import {View, Text} from 'react-native';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';
import {commonColors} from '../../docs/config';

const toastConfig = {
  success: props => (
    <SuccessToast
      {...props}
      style={{borderLeftColor: 'green'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  info: props => (
    <InfoToast
      {...props}
      style={{borderLeftColor: commonColors.primaryDarkColor}}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
  tomatoToast: ({text1, props}) => (
    <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};

export const CustomToast = () => {
  return <Toast config={toastConfig} />;
};
