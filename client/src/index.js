import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import "@rainbow-me/rainbowkit/styles.css";
//import "./index.css";
import App from "./App";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import {
  apiProvider,
  configureChains,
  RainbowKitProvider,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { createClient, chain, WagmiProvider } from "wagmi";

if (
  !process.env.REACT_APP_RINKEBY_URL ||
  //!process.env.REACT_APP_KOVAN_URL ||
  !process.env.REACT_APP_GRAPH_URL
)
  throw new Error(
    "Missing environment variables. Make sure to set your .env file."
  );

const { provider, chains } = configureChains(
  [chain.hardhat, chain.rinkeby],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "Ethereum Application with Wagmi and Rainbowkit",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.REACT_APP_GRAPH_URL,
});

ReactDOM.render(
  // <React.StrictMode>
  <WagmiProvider client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </RainbowKitProvider>
  </WagmiProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
);
