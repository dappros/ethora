import {
  audioMimetypes,
  imageMimetypes,
  pdfMimemtype,
  videoMimetypes,
} from "../constants/mimeTypes"

export const isVideoMimetype = (mimetype: string) => {
  return !!videoMimetypes[mimetype]
}

export const isImageMimetype = (mimetype: string) => {
  return !!imageMimetypes[mimetype]
}

export const isPdfMimetype = (mimetype: string) => {
  return !!pdfMimemtype[mimetype]
}
export const isAudioMimetype = (mimetype: string) => {
  return audioMimetypes[mimetype]
}
