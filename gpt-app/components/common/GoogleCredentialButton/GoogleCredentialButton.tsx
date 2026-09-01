"use client";

import { useEffect, useRef } from "react";
import {
  useGoogleOAuth,
  type CredentialResponse,
  type GsiButtonConfiguration,
  type IdConfiguration,
} from "@react-oauth/google";

type GoogleIdentityApi = {
  initialize: (config: IdConfiguration) => void;
  renderButton: (
    parent: HTMLElement,
    config: GsiButtonConfiguration & { locale?: string },
  ) => void;
};

type GoogleWindow = Window & {
  google?: { accounts?: { id?: GoogleIdentityApi } };
};

type ActiveLogin = {
  owner: symbol;
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
};

let initializedClientId: string | null = null;
let activeLogin: ActiveLogin | null = null;

const readGoogleIdentity = (): GoogleIdentityApi | null =>
  (window as GoogleWindow).google?.accounts?.id ?? null;

const ensureGoogleIdentityInitialized = (
  identity: GoogleIdentityApi,
  clientId: string,
) => {
  if (initializedClientId === clientId) return;

  identity.initialize({
    client_id: clientId,
    use_fedcm_for_button: false,
    callback: (response) => {
      if (!response.credential) {
        activeLogin?.onError();
        return;
      }
      activeLogin?.onSuccess(response);
    },
  });
  initializedClientId = clientId;
};

type GoogleCredentialButtonProps = GsiButtonConfiguration & {
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
};

const buttonHeight = { large: 40, medium: 32, small: 20 } as const;

export default function GoogleCredentialButton({
  onSuccess,
  onError,
  type = "standard",
  theme = "outline",
  size = "large",
  text,
  shape,
  logo_alignment,
  width,
}: GoogleCredentialButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ownerRef = useRef(Symbol("google-login"));
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const { clientId, locale, scriptLoadedSuccessfully } = useGoogleOAuth();

  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  useEffect(() => {
    const container = containerRef.current;
    if (!scriptLoadedSuccessfully || !container) return;

    const identity = readGoogleIdentity();
    if (!identity) {
      onErrorRef.current();
      return;
    }

    ensureGoogleIdentityInitialized(identity, clientId);
    const owner = ownerRef.current;
    container.replaceChildren();
    identity.renderButton(container, {
      type,
      theme,
      size,
      text,
      shape,
      logo_alignment,
      width,
      locale,
      click_listener: () => {
        activeLogin = {
          owner,
          onSuccess: (response) => onSuccessRef.current(response),
          onError: () => onErrorRef.current(),
        };
      },
    });

    return () => {
      container.replaceChildren();
      if (activeLogin?.owner === owner) activeLogin = null;
    };
  }, [
    clientId,
    locale,
    logo_alignment,
    scriptLoadedSuccessfully,
    shape,
    size,
    text,
    theme,
    type,
    width,
  ]);

  return <div ref={containerRef} style={{ height: buttonHeight[size] }} />;
}
