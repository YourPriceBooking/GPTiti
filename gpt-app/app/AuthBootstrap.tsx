"use client";

import { useEffect } from "react";

import { runSingleFlightRefresh } from "@/lib/authSession";
import { refreshUser } from "@/redux/auth/operations";
import {
  selectAccessTokenReady,
  selectIsLoggedIn,
} from "@/redux/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const accessTokenReady = useAppSelector(selectAccessTokenReady);

  useEffect(() => {
    if (!isLoggedIn || accessTokenReady) return;

    runSingleFlightRefresh(() => dispatch(refreshUser()).unwrap()).catch(
      () => {},
    );
  }, [isLoggedIn, accessTokenReady, dispatch]);

  return null;
}
