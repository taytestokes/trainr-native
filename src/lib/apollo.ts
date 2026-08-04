import { getSession } from "@/lib/storage";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

// URL to reach the graphql server
const GRAPHQL_URL =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

// Auth link (middleware) attaches the auth header to the request
const authLink = new SetContextLink(async (prevContext) => {
  const session = await getSession();

  return {
    headers: {
      ...prevContext.headers,
      authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : "",
    },
  };
});

// Http link (middleware) sends the request to the graphql server
// Under the hood, it uses the fetch API to send the request to the graphql server
const httpLink = new HttpLink({ uri: GRAPHQL_URL });

export const apolloClient = new ApolloClient({
  // Composes the chain of links to build the request
  link: ApolloLink.from([authLink, httpLink]),
  // Cache the data in the client for faster retrieval if possible
  cache: new InMemoryCache(),
});
