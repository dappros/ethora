import Toast from 'react-native-toast-message';

export const showToast = (type:string, title:string, desc:string, position:'top'|'bottom') => {
    Toast.show({
        type:type,
        text1:title,
        text2:desc,
        position:position
    })
}