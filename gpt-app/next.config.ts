import type { NextConfig } from "next";

const toOrigin = (url: string | undefined): string => {
  if (!url) return "";
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
};

const backendOrigin = toOrigin(process.env.NEXT_PUBLIC_BACKEND_API_URL);
const socketOrigin = toOrigin(process.env.NEXT_PUBLIC_SOCKET_URL);

const connectSources = [
  "'self'",
  backendOrigin,
  socketOrigin,
  // Socket.IO стартує з polling і піднімається до ws://; схему дозволяємо явно.
  socketOrigin.replace(/^http/, "ws"),
  "https://accounts.google.com",
]
  .filter(Boolean)
  .join(" ");

/**
 * CSP поки в Report-Only: увімкнення блокувального режиму без реального
 * прогону по всіх сторінках зламало б GSI-скрипт або inline-стилі emotion.
 * Порядок дій: подивитися звіти в консолі → прибрати зайве → перейменувати
 * ключ на "Content-Security-Policy".
 */

const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self'",
  "'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
  "https://accounts.google.com",
  "https://apis.google.com",
]
  .filter(Boolean)
  .join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  // emotion/MUI і Tailwind вставляють стилі інлайном.
  "style-src 'self' 'unsafe-inline'",
  "style-src-elem 'self' 'unsafe-inline' https://accounts.google.com",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://res.cloudinary.com",
  "font-src 'self' data:",
  `connect-src ${connectSources}`,
  "frame-src https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // ← дозволяє Google OAuth popup
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
