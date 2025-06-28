
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
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
import { ConfigurationProvider } from "./context/Configuration";
import App from "./app";
import { RestProvider } from "./context/Restaurant";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import { ThemeProvider as StylesThemeProvider } from "@mui/styles";
import theme from "./utils/theme";

export function Main() {
  return (
    <ConfigurationProvider>
      <MainWithConfig />
    </ConfigurationProvider>
  );
}

function MainWithConfig() {
  // Load configuration constants
  let ConfigurableValues;
  try {
    ConfigurableValues = require("./config/constants").default;
  } catch (error) {
    console.error("Failed to load configuration constants:", error);
    // Provide default values if config fails to load
    ConfigurableValues = () => ({
      SENTRY_DSN: '',
      GOOGLE_MAPS_KEY: '',
      SERVER_URL: 'http://localhost:4000',
      WS_SERVER_URL: 'ws://localhost:4000',
      VAPID_KEY: '',
      FIREBASE_KEY: '',
      AUTH_DOMAIN: '',
      PROJECT_ID: '',
      STORAGE_BUCKET: '',
      MSG_SENDER_ID: '',
      APP_ID: '',
      MEASUREMENT_ID: ''
    });
  }

  const { SENTRY_DSN, GOOGLE_MAPS_KEY, SERVER_URL, WS_SERVER_URL } =
    ConfigurableValues();
  console.log("GOOGLE_MAPS_KEY", GOOGLE_MAPS_KEY);

  useEffect(() => {
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.1,
      });
    }
  }, [SENTRY_DSN]);

  const cache = new InMemoryCache();
  const httpLink = createHttpLink({
    uri: `${SERVER_URL}/graphql`,
  });

  let wsLink;
  try {
    wsLink = new GraphQLWsLink(
      createClient({
        url: `${WS_SERVER_URL}/graphql`,
      })
    );
  } catch (error) {
    console.warn("WebSocket connection failed, using HTTP only:", error);
    wsLink = httpLink;
  }

  const request = async (operation: {
    setContext: (context: { headers: { authorization: string } }) => void;
  }) => {
    const data = localStorage.getItem("user-enatega");

    let token = null;
    if (data) {
      try {
        token = JSON.parse(data).token;
      } catch (error) {
        console.warn("Failed to parse user data:", error);
      }
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
        let handle: { unsubscribe: () => void } | null = null;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            if (forward) {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            }
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
  }, wsLink === httpLink ? httpLink : wsLink);

  const client = new ApolloClient({
    link: concat(ApolloLink.from([terminatingLink, requestLink]), httpLink),
    cache,
    resolvers: {},
    connectToDevTools: true,
  });

  return (
    <ApolloProvider client={client}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <StylesThemeProvider theme={theme}>
            <RestProvider>
              <App />
            </RestProvider>
          </StylesThemeProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  );
}

// Only create root if container exists and hasn't been used
const container = document.getElementById("root");
if (container && !container._reactRootContainer) {
  const root = createRoot(container);
  root.render(<Main />);
}
