export let IS_PRODUCTION: boolean = false;
const BASEDOMAIN = IS_PRODUCTION ? "dxmpp.com" : "dev.dxmpp.com";

export const CONFERENCEDOMAIN = "@conference." + BASEDOMAIN;
export const DOMAIN = "@" + BASEDOMAIN;
export const SERVICE = `wss://${BASEDOMAIN}:5443/ws`;

export const APIDOMAIN = IS_PRODUCTION ? "https://app.dappros.com/v1/" : "https://app-dev.dappros.com/v1/";