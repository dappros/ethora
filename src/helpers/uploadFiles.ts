import { showToast } from "../components/Toast/toast"
import { httpUpload } from "../config/apiService"

export const uploadFiles = async (file:any, token:string|undefined, url:string) => {
    if(file&&token){
        try{
            const response = await httpUpload(
                url,
                file,
                token,
                console.log
            )
            return response.data
        }catch(err){
            showToast(
                'error',
                'Error',
                'Cannot upload file, try again later',
                'top'
            );
            return false
        }
    }else{
        showToast(
            'error',
            'Error',
            'File or token error',
            'top'
        )
    }
}