import Toast from 'react-native-toast-message';

export const showError = (title, subtitle) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: subtitle,
    position: 'bottom',
  });
};
export const showInfo = (title, subtitle) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: subtitle,
    position: 'bottom',
  });
};
export const showSuccess = (title, subtitle) => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: subtitle,
    position: 'bottom',
  });
};
