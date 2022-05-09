import { useStores } from "../stores/context";


export const constructUrl = (route:string) => {
    const {defaultUrl} = useStores().apiStore;
    return defaultUrl + route;
};