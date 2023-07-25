import { config } from "../config";

export const NFMT_TYPES: Record<string, { type: string; color: string }> = {
  "1": { type: "free", color: "chocolate" },
  "2": { type: "silver", color: "grey" },
  "3": { type: "gold", color: "orange" },
};

export const NFMT_TRAITS: Record<string, { color: string }> = {
  Free: { color: "blue" },
  Silver: { color: "grey" },
  Gold: { color: "orange" },
  Bronze: { color: "chocolate" },
  Rare: { color: "lightgreen" },
  "Unique!": { color: "black" },
};

const BASEDOMAIN = config.IS_PRODUCTION ? "dxmpp.com" : "dev.dxmpp.com";
export const PUSH_URL = 'https://push.dxmpp.com:7777/api/v1';
export const CONFERENCEDOMAIN = "@conference." + BASEDOMAIN;
export const DOMAIN = "@" + BASEDOMAIN;
export const SERVICE = `wss://${BASEDOMAIN}:5443/ws`;
export const mobileEthoraBaseUrl = "https://eto.li?c=";

export const imageMimetypes = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpg",
} as const;
export const videoMimetypes = {
  "video/mp4": "video/mp4",
} as const;
export const audioMimetypes = {
  "audio/mpeg": "audio/mpeg",
  "audio/webm": "audio/webm",
  "application/octet-stream": "application/octet-stream",
  "audio/x-m4a": "audio/x-m4a",
} as const;

export const pdfMimemtype = {
  "application/pdf": "application/pdf",
} as const;

export const docsMimetypes = {
  "application/msword": "application/msword",
 
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

} as const;

export const excelMimetypes = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel": "application/vnd.ms-excel",
} as const
