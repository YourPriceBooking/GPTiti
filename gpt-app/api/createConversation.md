# Conversations API — Документація

---

## 1. Створення нового діалогу

### Запит

| Параметр  | Значення                                            |
| --------- | --------------------------------------------------- |
| Метод     | `POST`                                              |
| URL       | `http://localhost:7000/gpt-titi/api/conversations/` |
| Заголовок | `Authorization: Bearer <user_token>`                |

### Тіло запиту (Body)

```json
{
  "title": "Чат gpt-5.4",
  "modelId": "gpt-5.4"
}
```

| Поле      | Тип      | Обов'язкове | Опис                                                                   |
| --------- | -------- | ----------- | ---------------------------------------------------------------------- |
| `title`   | `string` | Ні          | Назва чату. За замовчуванням — `"New chat"`                            |
| `modelId` | `string` | Так         | Модель чату. Отримати список моделей: `GET /api/users/get-chat-models` |

### Успішна відповідь — `200 OK`

```json
{
  "user": "69496f6eba1cb5aab25860df",
  "title": "My chat",
  "modelId": "gpt-4o-mini",
  "summary": "",
  "archived": false,
  "_id": "69fdeee08ee9f8a5dc1a03bb",
  "lastMessageAt": "2026-05-08T14:10:40.344Z",
  "createdAt": "2026-05-08T14:10:40.353Z",
  "updatedAt": "2026-05-08T14:10:40.353Z"
}
```

> **`_id`** — ідентифікатор чату, використовується в подальших запитах до OpenAI.

### Відповідь при помилці — `500 Internal Server Error`

```json
{
  "status": 500,
  "message": "Internal server error"
}
```

---

## 2. Отримання всіх діалогів користувача

### Запит

| Параметр  | Значення                                            |
| --------- | --------------------------------------------------- |
| Метод     | `GET`                                               |
| URL       | `http://localhost:7000/gpt-titi/api/conversations/` |
| Заголовок | `Authorization: Bearer <user_token>`                |

### Успішна відповідь — `200 OK`

```json
[
  {
    "_id": "69fdf229122116a124ce1a9e",
    "title": "New chat",
    "lastMessageAt": "2026-05-08T14:24:41.351Z",
    "createdAt": "2026-05-08T14:24:41.360Z"
  },
  {
    "_id": "69fdf1afb6c3d3274474bfcc",
    "title": "New chat",
    "lastMessageAt": "2026-05-08T14:22:39.194Z",
    "createdAt": "2026-05-08T14:22:39.201Z"
  },
  {
    "_id": "69fdeee08ee9f8a5dc1a03bb",
    "title": "My chat",
    "lastMessageAt": "2026-05-08T14:10:40.344Z",
    "createdAt": "2026-05-08T14:10:40.353Z"
  }
]
```

### Відповідь при помилці — `500 Internal Server Error`

```json
{
  "status": 500,
  "message": "Internal server error"
}
```

---

## 3. Видалення діалогу

### Запит

| Параметр  | Значення                                               |
| --------- | ------------------------------------------------------ |
| Метод     | `DELETE`                                               |
| URL       | `http://localhost:7000/gpt-titi/api/conversations/:id` |
| Заголовок | `Authorization: Bearer <user_token>`                   |

> Для користувача чат **видаляється**, для системи — **архівується**.

### Успішна відповідь — `200 OK`

```json
{
  "success": true
}
```

### Чат не знайдено — `404 Not Found`

```json
{
  "error": "Conversation not found"
}
```

### Відповідь при помилці — `500 Internal Server Error`

```json
{
  "status": 500,
  "message": "Internal server error"
}
```

---

## 4. Отримання всіх повідомлень діалогу

### Запит

| Параметр  | Значення                                                        |
| --------- | --------------------------------------------------------------- |
| Метод     | `GET`                                                           |
| URL       | `http://localhost:7000/gpt-titi/api/conversations/:id/messages` |
| Заголовок | `Authorization: Bearer <user_token>`                            |

де `:id` — ідентифікатор діалогу (наприклад, `69fdedc85c91ced88597b14d`).

### Успішна відповідь — `200 OK`

```json
[
  {
    "_id": "69fe43e9802e691e4448608a",
    "user": "69496f6eba1cb5aab25860df",
    "conversation": "69fdedc85c91ced88597b14d",
    "role": "user",
    "content": "Расскажи историю",
    "modelId": "gpt-4o-mini",
    "tokens": 0,
    "deleted": null,
    "createdAt": "2026-05-08T20:13:29.139Z",
    "updatedAt": "2026-05-08T20:13:29.139Z",
    "__v": 0
  },
  {
    "_id": "69fe43f3802e691e4448608e",
    "user": "69496f6eba1cb5aab25860df",
    "conversation": "69fdedc85c91ced88597b14d",
    "role": "assistant",
    "content": "Конечно! Вот небольшая история: ...",
    "modelId": "gpt-4o-mini",
    "tokens": 0,
    "deleted": null,
    "createdAt": "2026-05-08T20:13:39.790Z",
    "updatedAt": "2026-05-08T20:13:39.790Z",
    "__v": 0
  }
]
```

### Поля повідомлення

| Поле           | Тип                       | Опис                                               |
| -------------- | ------------------------- | -------------------------------------------------- |
| `_id`          | `string`                  | Унікальний ідентифікатор повідомлення              |
| `user`         | `string`                  | ID користувача                                     |
| `conversation` | `string`                  | ID діалогу                                         |
| `role`         | `"user"` \| `"assistant"` | Роль відправника                                   |
| `content`      | `string`                  | Текст повідомлення                                 |
| `modelId`      | `string`                  | Ідентифікатор моделі                               |
| `tokens`       | `number`                  | Кількість використаних токенів                     |
| `deleted`      | `null` \| `string`        | Статус видалення                                   |
| `createdAt`    | `string` (ISO 8601)       | Дата створення                                     |
| `updatedAt`    | `string` (ISO 8601)       | Дата оновлення                                     |
| `meta`         | `object` (опціонально)    | Додаткова інформація (токени застосунку, вартість) |

### Чат не знайдено — `404 Not Found`

```json
{
  "error": "Conversation not found"
}
```

### Відповідь при помилці — `500 Internal Server Error`

```json
{
  "status": 500,
  "message": "Internal server error"
}
```
