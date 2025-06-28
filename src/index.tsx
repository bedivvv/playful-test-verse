
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  concat,
  createHttpLink,
  Observable,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import "firebase/messaging";
import * as Sentry from "@sentry/react";
import ConfigurableValues from "./config/constants";
import { ConfigurationProvider } from "./context/Configuration";
import App from "./app";
import { RestProvider } from "./context/Restaurant";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import theme from "./utils/theme";

function Main() {
  const {
    SENTRY_DSN,
    GOOGLE_MAPS_KEY,
    SERVER_URL,
    WS_SERVER_URL,
  } = ConfigurableValues();
  console.log("GOOGLE_MAPS_KEY", GOOGLE_MAPS_KEY);
  
  useEffect(() => {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 0.1,
    });
  }, [SENTRY_DSN]);

  const cache = new InMemoryCache();
  const httpLink = createHttpLink({
    uri: `${SERVER_URL}/graphql`,
  });
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${WS_SERVER_URL}/graphql`,
    })
  );
  const request = async (operation: any) => {
    const data = localStorage.getItem("user-enatega");

    let token = null;
    if (data) {
      token = JSON.parse(data).token;
    }
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: any;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );
  
  const terminatingLink = split(({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  }, wsLink);

  const client = new ApolloClient({
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
    cache,
    resolvers: {},
    connectToDevTools: true,
  });

  return (
    <ApolloProvider client={client}>
      <ConfigurationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <RestProvider>
              <App />
            </RestProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ConfigurationProvider>
    </ApolloProvider>
  );
}

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(<Main />, document.getElementById("root"));
