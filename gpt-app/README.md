This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# not to use
  # or
  # yarn dev
  # or
  # pnpm dev
  # or
  # bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

    The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## reusing and redact routes to backend

усі роути написані в helpers/api.ts
типи що використовуються в types/api.types.ts

приклад використання:

import { api } from "@/helpers/api";
......
const conversations = await api.getConversations();

далі-обробляти дані так, як зі звичайними данними, що прийшли з того чи іншого роуту бек енду
  далі-обробляти дані так, як зі звичайними данними, що прийшли з того чи іншого роуту бек енду

## Socket.IO (frontend)

Frontend uses `socket.io-client` (pinned) and is wired via `SocketProvider`.

To enable the connection set these env vars (at build time):

- `NEXT_PUBLIC_SOCKET_URL` (example: `http://localhost:4000` or `https://your-domain.com`)
- `NEXT_PUBLIC_SOCKET_PATH` (optional, example: `/gpt-titi/socket.io`; default is Socket.IO standard `/socket.io` when omitted)

Optional for local testing without auth:

- `NEXT_PUBLIC_SOCKET_ALLOW_GUEST=true`

Auth token is sent as: `socket.handshake.auth.token`.

---

## 🛰️ Інтеграція WebSocket (тільки фронтенд)

### 1. Змінні оточення для WebSocket

Додайте у файл .env.local (або .env) лише ці змінні:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:7000
NEXT_PUBLIC_SOCKET_PATH=/socket.io
NEXT_PUBLIC_SOCKET_ALLOW_GUEST=true
```

- `NEXT_PUBLIC_SOCKET_URL` — адреса вашого WS-сервера.
- `NEXT_PUBLIC_SOCKET_PATH` — шлях для підключення (зазвичай /socket.io).
- `NEXT_PUBLIC_SOCKET_ALLOW_GUEST` — дозволити гостьове підключення (без авторизації).

---

### 2. Як підписуватись на події та надсилати повідомлення через WebSocket

- Для підписки на повідомлення використовуйте хук `useWs()` та метод `onMessage`:

```tsx
import { useWs } from "@/context/WsContext";
import { useEffect } from "react";

const { onMessage } = useWs();

useEffect(() => {
  const unsubscribe = onMessage((msg) => {
    // обробка вхідного повідомлення
    if (msg.event === "chat") {
      // ...
    }
  });
  return unsubscribe;
}, [onMessage]);
```

- Для надсилання повідомлень використовуйте метод `emit`:

```tsx
import { useWs } from "@/context/WsContext";
import { WsEvent } from "@/types/ws.types";

const { emit } = useWs();

emit({
  event: WsEvent.TESTFRONT,
  type: "front-test",
  payload: { hello: "from frontend" },
  requestId: "your-request-id",
});
```

---

### 3. Приклади: як надіслати та отримати повідомлення

**Приклад надсилання (emit) події:**

```tsx
emit({
  event: WsEvent.TESTFRONT,
  type: "front-test",
  payload: { hello: "from frontend" },
  requestId: "test-req-123",
});
```

**Приклад підписки (onMessage) на подію:**

```tsx
useEffect(() => {
  const unsub = onMessage((msg) => {
    if (msg.event === WsEvent.TESTBACK) {
      console.log("Відповідь від сервера:", msg);
    }
  });
  return unsub;
}, [onMessage]);
```

---

Вся взаємодія з WebSocket централізована через хук `useWs` та типи з `ws.types.ts`. За потреби адаптуйте приклади під свій компонент.
