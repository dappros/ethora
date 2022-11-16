import { gql } from "@apollo/client";

export const COUNT = gql`
  subscription Count {
    count
  }
`;
