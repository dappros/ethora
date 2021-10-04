import { unv_url, unv_url1 } from "../../docs/config";

export default parseChatLink=(url)=>{
    let parsedLink = "";
    if(url.includes(unv_url)){
        parsedLink = url.replace(unv_url, '');
    }
    if(url.includes(unv_url1)){
        parsedLink = url.replace(unv_url1, '')
    }
    return parsedLink
}