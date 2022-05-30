import { showToast } from "../components/Toast/toast";
import { useStores } from "../stores/context";


export const constructUrl = (route:string|undefined) => {
    if(route){
        const {defaultUrl} = useStores().apiStore;
        return defaultUrl + route;
    }else{
        showToast('error', 'Error', 'Route not found', 'top')
    }
};