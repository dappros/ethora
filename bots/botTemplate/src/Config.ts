export let IS_PRODUCTION: boolean = false;
const BASEDOMAIN: string = IS_PRODUCTION ? "dxmpp.com" : "dev.dxmpp.com";

export const CONFERENCEDOMAIN: string = "@conference." + BASEDOMAIN;
export const DOMAIN: string = "@" + BASEDOMAIN;
export const SERVICE: string = `wss://${BASEDOMAIN}:5443/ws`;

export const APIDOMAIN: string = IS_PRODUCTION ? "https://app.dappros.com/v1/" : "https://app-dev.dappros.com/v1/";
export const TOKENJWT: string = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYxZTU1YzlkOTBlYTk5NTk0YmM3ZTZhMiIsImFwcE5hbWUiOiJFdGhvcmEiLCJhcHBHb29nbGVJZCI6Ijk3MjkzMzQ3MDA1NC1oYnNmMjlvaHBhdG83NnRpbDJqdGY2amdnMWI0Mzc0Yy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImNyZWF0b3JJZCI6IjYyYzNmNGE5M2FkMjcwNjc0YzFmNjJmYiIsImNyZWF0ZWRBdCI6IjIwMjItMDctMDVUMDg6Mjc6MjYuMzM2WiIsIl9fdiI6MH0sImlhdCI6MTY1NzAwOTY1OH0.dnvrO_dQ_2GLyUX-b71CcHFDnphpjeTYOxz6vZ2fsPY';