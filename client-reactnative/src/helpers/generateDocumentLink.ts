interface ILink {
  linkToken: string;
}

export const generateDocumentLink = ({linkToken}: ILink) => {
  return ` https://app-dev.dappros.com/v1/docs/share/${linkToken}`;
};
