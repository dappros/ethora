import { apiModes, appEndpoint } from "../../docs/config"

interface ILink {
  linkToken: string
}

export const generateDocumentLink = ({ linkToken }: ILink) => {
  return `${apiModes[appEndpoint]}/docs/share/${linkToken}`
}
