import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {showToast} from '../components/Toast/toast';
import Share from 'react-native-share';

export const downloadFile = async (url: string, filename: string) => {
  // Get today's date to add the time suffix in filename
  var date = new Date();

  const {
    dirs: {DownloadDir, DocumentDir},
  } = RNFetchBlob.fs;
  const {config} = RNFetchBlob;
  const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
  const fPath =
    aPath + '/' + Math.floor(date.getTime() + date.getSeconds() / 2) + filename;

  const configOptions = Platform.select({
    ios: {
      fileCache: true,
      path: fPath,
      notification: true,
    },

    android: {
      fileCache: false,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: fPath,
        description: 'Downloading file',
      },
    },
  });

  config(configOptions)
    .fetch('GET', url)
    .then(res => {
      if (Platform.OS === 'ios') {
        try {
          const resp = RNFetchBlob.fs
            .writeFile(configOptions.path, res.data, 'base64')
            .then(a => {
              filePath = res.data;
              let options = {
                //  type: type,
                url: filePath, // (Platform.OS === 'android' ? 'file://' + filePath)
              };
              Share.open(options).then(_ => {
                showToast(
                  'success',
                  'Success',
                  'File downloaded successfully',
                  'top',
                );
              });
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        showToast('success', 'Success', 'File downloaded successfully', 'top');

        console.log('downloaded');
      }
    });
};
