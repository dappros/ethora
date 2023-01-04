import { gql } from "@apollo/client";

export const COUNT = gql`
  subscription Count {
    count
  }
`;

export const TRRANSFER_TO_SUBSCRIPTION = gql`
  subscription onTransferTo(
    $walletAddress: String!
    $contractAddress: String!
  ) {
    transferTo(
      walletAddress: $walletAddress
      contractAddress: $contractAddress
    ) {
      amount
      senderLastName
      senderFirstName
    }
  }
`;
