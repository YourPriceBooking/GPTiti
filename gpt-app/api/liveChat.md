# Live Chat API — Документація

Комунікація відбувається через **WebSocket (Socket.IO)**, окрім завантаження файлів — воно виконується через **HTTPS**.

---

## 1. Робота з картинками

### Крок 1 — Завантаження файлу на сервер

| Параметр | Значення                                             |
| -------- | ---------------------------------------------------- |
| Метод    | `POST`                                               |
| URL      | `https://ypbooking.chost.com.ua/gpt-titi/api/upload` |
| Body     | `multipart/form-data` — сам файл                     |

#### Успішна відповідь — `200 OK`

```json
{
  "success": true,
  "file": {
    "url": "https://res.cloudinary.com/your-price-booking/image/upload/v1780147280/gpt-titi/nhzchmlzzhzlrjee9ftk.jpg",
    "publicId": "gpt-titi/nhzchmlzzhzlrjee9ftk",
    "mimetype": "image/jpeg",
    "size": 161859,
    "originalName": "photo_2026-05-29_23-03-28.jpg",
    "expiresAt": "2026-05-31T13:21:21.719Z"
  }
}
```

| Поле           | Тип                 | Опис                                                    |
| -------------- | ------------------- | ------------------------------------------------------- |
| `url`          | `string`            | Публічне посилання на файл (передається у сокет-запиті) |
| `publicId`     | `string`            | Ідентифікатор файлу в Cloudinary                        |
| `mimetype`     | `string`            | MIME-тип файлу                                          |
| `size`         | `number`            | Розмір файлу в байтах                                   |
| `originalName` | `string`            | Оригінальна назва файлу                                 |
| `expiresAt`    | `string` (ISO 8601) | Час, до якого файл доступний                            |

### Крок 2 — Надсилання повідомлення з файлом через сокет

Після завантаження файлу передаємо його `url` у полі `files` разом із повідомленням:

```json
{
  "event": "chat:send",
  "type": "send-request",
  "payload": {
    "message": "Расскажи историю",
    "conversationId": "69fdedc85c91ced88597b14d",
    "modelId": "gpt-4o-mini",
    "files": "<url з відповіді /api/upload>"
  }
}
```

---

## 2. Надсилання повідомлення без файлу

Якщо файл не потрібен — надсилаємо запит через сокет без поля `files`:

```json
{
  "event": "chat:send",
  "type": "send-request",
  "payload": {
    "message": "Расскажи историю",
    "conversationId": "69fdedc85c91ced88597b14d",
    "modelId": "gpt-4o-mini"
  }
}
```

### Поля payload

| Поле             | Тип      | Обов'язкове | Опис                                 |
| ---------------- | -------- | ----------- | ------------------------------------ |
| `message`        | `string` | Так         | Текст повідомлення користувача       |
| `conversationId` | `string` | Так         | ID діалогу                           |
| `modelId`        | `string` | Так         | ID моделі (наприклад, `gpt-4o-mini`) |
| `files`          | `string` | Ні          | URL завантаженого файлу              |

### Приклад на фронтенді

```js
socket.emit("chat:send", {
  event: "chat:send",
  type: "send-request",
  payload: {
    message: text,
    conversationId,
    modelId,
    files,
  },
});
```

---

## 3. Підключення до сокету

Підключення до сервера: `https://ypbooking.chost.com.ua`  
У параметрі `auth` передаємо токен користувача.

```js
const socket = io("https://ypbooking.chost.com.ua", {
  auth: {
    token,
  },
});
```

---

## 4. Події сокету

### `socket:connected` — успішне підключення

Сервер підтверджує встановлення з'єднання:

```json
{
  "event": "socket-connected",
  "type": "response",
  "payload": {
    "message": "Connection established",
    "socketId": "<socket.id>",
    "userId": "<user._id>"
  }
}
```

```js
socket.on("socket:connected", (data) => {
  console.log("SERVER:", data);
});
```

---

### `chat:stream` — стрімінг відповіді

Сервер повертає відповідь частинами (chunks) під час обробки запиту:

```json
{
  "event": "chat-stream",
  "type": "response",
  "chunk": "<частина тексту відповіді>"
}
```

```js
socket.on("chat:stream", ({ chunk }) => {
  // Додаємо chunk до відображення відповіді асистента
});
```

---

### `chat:end` — завершення відповіді

Сервер сигналізує про завершення стріму:

```json
{
  "event": "chat-end",
  "type": "response",
  "messages": "chat ended"
}
```

```js
socket.on("chat:end", () => {
  // Відповідь завершена
});
```

---

### `chat:error` — помилка

```js
socket.on("chat:error", (err) => {
  console.error(err);
});
```

---

## 5. Повний приклад підключення та прослуховування

```js
function connectSocket() {
  const token = document.getElementById("token").value;

  const socket = io("https://ypbooking.chost.com.ua", {
    auth: { token },
  });

  socket.on("socket:connected", (data) => {
    console.log("SERVER:", data);
  });

  socket.on("chat:stream", ({ chunk }) => {
    // Додаємо chunk до відповіді асистента
  });

  socket.on("chat:end", () => {
    // Стрім завершено
  });

  socket.on("chat:error", (err) => {
    console.error(err);
  });
}
```
