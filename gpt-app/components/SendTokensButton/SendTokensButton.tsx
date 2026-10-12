"use client";

import { useCallback, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import LoginModal from "@/components/HomePage/common/LoginModal/LoginModal";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";

import ActionTooltip from "@/components/common/ActionTooltip/ActionTooltip";

import SendTokensModal from "./SendTokensModal";

interface Props {
  className: string;
  children: ReactNode;
}

export default function SendTokensButton({ className, children }: Props) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label="Send TITI tokens"
        onClick={() => {
          if (isLoggedIn) setIsOpen(true);
          else setIsLoginOpen(true);
        }}
      >
        {children}
        <ActionTooltip label="Send TITI tokens" appearance="plain" />
      </button>
      {isOpen &&
        createPortal(<SendTokensModal onClose={closeModal} />, document.body)}
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
