import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://app-dev.dappros.com/graphql",
  cache: new InMemoryCache(),
});

export default client;
