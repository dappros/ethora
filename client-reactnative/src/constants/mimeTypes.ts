/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

type TImageMimeType = 'image/png' | 'image/jpeg' | 'image/jpg';
type TVideoMimeType = 'video/mp4';
type TAudioMimeType = 'audio/mpeg' | 'application/octet-stream' | 'audio/x-m4a';
type TPdfMimeType = 'application/pdf';

export const imageMimetypes: Record<TImageMimeType, TImageMimeType> = {
  'image/png': 'image/png',
  'image/jpeg': 'image/jpeg',
  'image/jpg': 'image/jpg',
};
export const videoMimetypes: Record<TVideoMimeType, TVideoMimeType> = {
  'video/mp4': 'video/mp4',
};
export const audioMimetypes: Record<TAudioMimeType, TAudioMimeType> = {
  'audio/mpeg': 'audio/mpeg',
  'application/octet-stream': 'application/octet-stream',
  'audio/x-m4a': 'audio/x-m4a',
};

export const pdfMimemtype: Record<TPdfMimeType, TPdfMimeType> = {
  'application/pdf': 'application/pdf',
};
