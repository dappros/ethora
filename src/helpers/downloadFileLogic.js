import {Alert, PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-simple-toast';

export default DownloadFile = async(props, callback) => {

    const {fileURL, fileName, closeModal} = props;
    console.log(props,"adfafafagdfnbgd")
    if(Platform.OS === 'ios') {
        downloadFile();
    }
    else{
        try{
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message: 'Application needs access to your storage to download file'
                }
            );
                // console.log(PermissionsAndroid.PERMISSIONS.RESULTS.GRANTED)
            if(granted === PermissionsAndroid.RESULTS.GRANTED){
                downloadFile();
            }else{
                Alert.alert('Error', 'Storage permission not granted');
            }
        }catch(err){
            console.log("++++",err)
        }
    }

    function downloadFile(){
        console.log("inhererererere")
        let date = new Date();
        let FILE_URL = fileURL;
        let file_ext = getFileExtention(FILE_URL);
        const {dirs} = RNFetchBlob.fs;
        console.log(file_ext)
        file_ext = '.' + file_ext[0];
        const { config, fs} = RNFetchBlob;
        let RootDir = fs.dirs.PictureDir;
        const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
        console.log(dirToSave);
        const configfb = {
            fileCache:true,
            useDownloadManager:true,
            notification:true,
            mediaScannable:true,
            path:dirToSave+"/file_"+Math.floor(date.getTime() + date.getSeconds()/2) + 
            file_ext
        }
        const configOptions = Platform.select({
            ios: {
                fileCache: configfb.fileCache,
                path: configfb.path,
            },
            android: configfb,
        });

        let options = {
            fileCache: true,
            path:dirToSave+"/"+fileName,
            addAndroidDownloads: {
                path:dirToSave+"/"+fileName,
                description: 'downloading file...',
                notification: true,
                useDownloadManager: true
            }
        };

        config(options)
        .fetch('GET', FILE_URL)
        .then(res => {
            console.log(res,"fileDownload")
            // alert('File downloaded successfully');
            // Toast.show('File downloaded successfully', Toast.LONG);
            closeModal;
            if (Platform.OS === "ios") {
                console.log("asdfsfasdf")
                RNFetchBlob.ios.openDocument(res.path());
                // RNFetchBlob.fs.writeFile(res.path(),res.path())
                // .android.actionViewIntent
                callback(res.path());
            }
            if(Platform.OS === "android"){
                RNFetchBlob.android.actionViewIntent(res.path(),props.mimetype)
                callback(res.path());
            }
        })


    }

    function getFileExtention(fileUrl){
        return /[.]/.exec(fileUrl)?
        /[^.]+$/.exec(fileUrl) : undefined;
    }

}