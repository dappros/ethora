const isDev = true;
export const SERVICE = isDev?"wss://z.okey.com.ua:5443/ws":"wss://rtc-gk.dappros.com:5443/ws";// dev
export const DOMAIN = isDev?"z.okey.com.ua":"rtc-gk.dappros.com"; //dev
export const CONFERENCEDOMAIN = isDev?"@conference.z.okey.com.ua":"@conference.rtc-gk.dappros.com"//dev
export const CONF_WITHOUT = isDev?"conference.z.okey.com.ua":"conference.rtc-gk.dappros.com"