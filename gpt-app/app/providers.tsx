"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { store, persistor } from "@/redux/store";

import { SocketProvider } from "@/context/SocketContext";
import { WsProvider } from "@/context/WsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <SocketProvider>
            <WsProvider>{children}</WsProvider>
          </SocketProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}
