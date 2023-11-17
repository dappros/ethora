import {
  audioMimetypes,
  docsMimetypes,
  excelMimetypes,
  imageMimetypes,
  pdfMimemtype,
  videoMimetypes,
} from "../constants"

export const isAudtioMimetype = (mimetype: string) => {
  return !!audioMimetypes[mimetype]
}
export const isImageMimetype = (mimetype: string) => {
  return !!imageMimetypes[mimetype]
}

export const isVideoMimetype = (mimetype: string) => {
  return !!videoMimetypes[mimetype]
}
export const isPdfMimetype = (mimetype: string) => {
  return !!pdfMimemtype[mimetype]
}
export const isDocumentMimetype = (mimetype: string) => {
  return !!docsMimetypes[mimetype]
}
export const isExcelMimetype = (mimetype: string) => {
  return !!excelMimetypes[mimetype]
}
