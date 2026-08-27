"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { store, persistor } from "@/redux/store";
import { env } from "@/lib/env";

import AuthBootstrap from "./AuthBootstrap";
import SessionExpiredModal from "./SessionExpiredModal";
import ErrorToast from "@/components/common/ErrorToast/ErrorToast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={env.googleClientId}>
          <AuthBootstrap />
          {children}
          <SessionExpiredModal />
          <ErrorToast />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}
