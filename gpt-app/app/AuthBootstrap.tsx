"use client";

import { useEffect } from "react";

import { runSingleFlightRefresh } from "@/lib/authSession";
import { refreshUser } from "@/redux/auth/operations";
import { selectAccessToken, selectIsLoggedIn } from "@/redux/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";


export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!isLoggedIn || accessToken) return;

    runSingleFlightRefresh(() => dispatch(refreshUser()).unwrap()).catch(
      () => {
      },
    );
  }, [isLoggedIn, accessToken, dispatch]);

  return null;
}
