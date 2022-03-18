import {Alert, Platform} from 'react-native';

export const getImageTypes = () => {
  return Platform.OS === 'android'
    ? ['image/png', 'image/jpeg']
    : ['public.png', 'public.jpeg'];
};

export const getVideoTypes = () => {
  return Platform.OS === 'android' ? ['video/mp4'] : ['public.mpeg-4'];
};

export const sessionExpired = onPress => {
  Alert.alert('Warning', 'Your session expired, please login again', [
    {
      text: 'Ok',
      onPress: () => onPress(),
    },
  ]);
};
