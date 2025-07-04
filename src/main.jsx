
import React from "react";
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
import { Integrations } from "@sentry/tracing";
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
  
  React.useEffect(() => {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 0.1,
    });
  }, []);

  const cache = new InMemoryCache();
  const httpLink = createHttpLink({
    uri: `${SERVER_URL}/graphql`,
  });
  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${WS_SERVER_URL}/graphql`,
    })
  );
  const request = async (operation) => {
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
        let handle;
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
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
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

// React 17 render API
const container = document.getElementById("root");
ReactDOM.render(<Main />, container);
