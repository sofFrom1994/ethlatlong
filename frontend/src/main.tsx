import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import App from './App.tsx'
import { config } from './wagmi.ts'

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import "./styles/index.css"
import './styles/App.css'
import "./styles/react-aria.css"

import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
