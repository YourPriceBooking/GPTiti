"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn, selectUser } from "@/redux/auth/selectors";
import styles from "./AccountAvatar.module.css";

export default function AccountAvatar() {
  const user = useAppSelector(selectUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = isLoggedIn ? user?.avatar?.trim() : undefined;
  const label = isLoggedIn ? user?.email || "Account" : "Guest";
  const initial = Array.from(label)[0]?.toLocaleUpperCase() || "U";

  return (
    <span className={styles.avatar} role="img" aria-label={label} title={label}>
      {src && src !== failedSrc ? (
        <Image
          key={src}
          src={src}
          alt=""
          width={40}
          height={40}
          className={styles.photo}
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
        />
      ) : isLoggedIn ? (
        <span aria-hidden="true">{initial}</span>
      ) : (
        <Image src="/icons/ghost-user.svg" alt="" width={22} height={28} />
      )}
    </span>
  );
}
