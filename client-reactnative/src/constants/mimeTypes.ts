/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

export type TImageMimeType = "image/png" | "image/jpeg" | "image/jpg"
export type TVideoMimeType = "video/mp4"
export type TAudioMimeType =
  | "audio/mpeg"
  | "application/octet-stream"
  | "audio/x-m4a"
  | "audio/webm"
export type TPdfMimeType = "application/pdf"
export type TCombinedMimeType =
  | TAudioMimeType
  | TImageMimeType
  | TPdfMimeType
  | TVideoMimeType
export const imageMimetypes: Record<string, TImageMimeType> = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpg",
}
export const videoMimetypes: Record<string, TVideoMimeType> = {
  "video/mp4": "video/mp4",
}
export const audioMimetypes: Record<string, TAudioMimeType> = {
  "audio/mpeg": "audio/mpeg",
  "audio/webm": "audio/webm",
  "application/octet-stream": "application/octet-stream",
  "audio/x-m4a": "audio/x-m4a",
}

export const pdfMimemtype: Record<string, TPdfMimeType> = {
  "application/pdf": "application/pdf",
}
