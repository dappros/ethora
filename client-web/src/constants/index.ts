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

export const CONFERENCEDOMAIN = "@conference.dev.dxmpp.com";
export const DOMAIN = "@dev.dxmpp.com";

export const mobileEthoraBaseUrl = "https://www.eto.li/go?c=";

export type TImageMimeType = "image/png" | "image/jpeg" | "image/jpg";
export type TVideoMimeType = "video/mp4";
export type TAudioMimeType = "audio/mpeg" | "application/octet-stream" | "audio/x-m4a";
export type TPdfMimeType = "application/pdf";
export type TCombinedMimeType =
  | TAudioMimeType
  | TImageMimeType
  | TPdfMimeType
  | TVideoMimeType;
export const imageMimetypes: Record<TImageMimeType, TImageMimeType> = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpg",
};
export const videoMimetypes: Record<TVideoMimeType, TVideoMimeType> = {
  "video/mp4": "video/mp4",
};
export const audioMimetypes: Record<TAudioMimeType, TAudioMimeType> = {
  "audio/mpeg": "audio/mpeg",
  "application/octet-stream": "application/octet-stream",
  "audio/x-m4a": "audio/x-m4a",
};

export const pdfMimemtype: Record<TPdfMimeType, TPdfMimeType> = {
  "application/pdf": "application/pdf",
};
