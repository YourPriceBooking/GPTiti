# Проект — API документація

Базовий URL: `http://localhost:7000`

Усі запити потребують передачі токена юзера в заголовку.

---

## 1. Створити проект

**POST** `/project/`

### Тіло запиту

```json
{
  "title": "My project with GPT-Titi",
  "description": "Test project",
  "icon": "folder",
  "color": "#3B82F6",
  "defaultModel": "gpt-5.5",
  "systemPrompt": ""
}
```

| Поле           | Опис                |
| -------------- | ------------------- |
| `title`        | назва проекту       |
| `description`  | опис проекту        |
| `icon`         | назва папки         |
| `color`        | колір папки         |
| `defaultModel` | модель              |
| `systemPrompt` | системна інформація |

### Успішна відповідь

```json
{
  "user": "69496f6eba1cb5aab25860df",
  "title": "My project with GPT-Titi",
  "description": "Test project",
  "icon": "folder",
  "color": "#3B82F6",
  "defaultModel": "gpt-5.5",
  "systemPrompt": "",
  "archived": false,
  "deleted": null,
  "_id": "6a43d5521ee828e858d700b3",
  "lastActivityAt": "2026-06-30T14:40:18.439Z",
  "createdAt": "2026-06-30T14:40:18.444Z",
  "updatedAt": "2026-06-30T14:40:18.444Z"
}
```

### Помилка (код 500)

```json
{
  "message": "Cannot create project"
}
```

---

## 2. Отримати всі проекти

**GET** `/project/`

### Успішна відповідь

```json
[
  {
    "_id": "6a43d5521ee828e858d700b3",
    "user": "69496f6eba1cb5aab25860df",
    "title": "My project with GPT-Titi",
    "description": "Test project",
    "icon": "folder",
    "color": "#3B82F6",
    "defaultModel": "gpt-5.5",
    "systemPrompt": "",
    "archived": false,
    "deleted": null,
    "lastActivityAt": "2026-06-30T14:40:18.439Z",
    "createdAt": "2026-06-30T14:40:18.444Z",
    "updatedAt": "2026-06-30T14:40:18.444Z",
    "conversationCount": 0
  }
]
```

### Помилка (код 500)

```json
{
  "message": "Cannot get projects"
}
```

---

## 3. Отримати один проект

**GET** `/project/{id}`

Приклад: `/project/6a43d5521ee828e858d700b3`, де `6a43d5521ee828e858d700b3` — ід проекту.

### Успішна відповідь

```json
{
  "_id": "6a43d5521ee828e858d700b3",
  "user": "69496f6eba1cb5aab25860df",
  "title": "My project with GPT-Titi",
  "description": "Test project",
  "icon": "folder",
  "color": "#3B82F6",
  "defaultModel": "gpt-5.5",
  "systemPrompt": "",
  "archived": false,
  "deleted": null,
  "lastActivityAt": "2026-06-30T14:40:18.439Z",
  "createdAt": "2026-06-30T14:40:18.444Z",
  "updatedAt": "2026-06-30T14:40:18.444Z",
  "conversations": []
}
```

`conversations` — масив ід діалогів.

### Помилка (код 500)

```json
{
  "message": "Cannot get project"
}
```

---

## 4. Оновити проект (змінити назву та інше)

**PATCH** `/project/{id}`

Приклад: `/project/6a43d5521ee828e858d700b3`, де `6a43d5521ee828e858d700b3` — ід проекту.

### Тіло запиту

```json
{
  "title": "My project with GPT-Titi 77",
  "description": "Test project New",
  "icon": "folder",
  "color": "#3B82F6",
  "defaultModel": "gpt-5.5",
  "systemPrompt": "",
  "archived": "false"
}
```

### Успішна відповідь

```json
{
  "_id": "6a43d5521ee828e858d700b3",
  "user": "69496f6eba1cb5aab25860df",
  "title": "My project with GPT-Titi 77",
  "description": "Test project New",
  "icon": "folder",
  "color": "#3B82F6",
  "defaultModel": "gpt-5.5",
  "systemPrompt": "",
  "archived": false,
  "deleted": null,
  "lastActivityAt": "2026-06-30T14:40:18.439Z",
  "createdAt": "2026-06-30T14:40:18.444Z",
  "updatedAt": "2026-06-30T14:48:09.541Z"
}
```

### Помилка — проект не знайдено (код 404)

```json
{
  "message": "Project not found"
}
```

### Помилка (код 500)

```json
{
  "message": "Cannot update project"
}
```

---

## 5. Видалити проект

**DELETE** `/project/{id}`

Приклад: `/project/6a43d5521ee828e858d700b3`, де `6a43d5521ee828e858d700b3` — ід проекту.

### Успішна відповідь

```json
{
  "success": true
}
```

### Помилка — проект не знайдено (код 404)

```json
{
  "message": "Project not found"
}
```

### Помилка (код 500)

```json
{
  "message": "Cannot update project"
}
```

---

## 6. Додати чат до проекту

**POST** `/project/{id}/conversations`

Приклад: `/project/6a43d5521ee828e858d700b3/conversations`, де `6a43d5521ee828e858d700b3` — ід проекту.

### Тіло запиту

```json
{
  "conversationIds": ["69fdedc85c91ced88597b14d"]
}
```

`conversationIds` — масив ід чатів. Юзер може додати до проекту більше одного чату.

### Успішна відповідь

```json
{
  "success": true,
  "modified": 1
}
```

---

## 7. Видалити чат з проекту

**DELETE** `/project/{projectId}/conversations/{conversationId}`

Приклад: `/project/6a43d5521ee828e858d700b3/conversations/69fdedc85c91ced88597b14d`, де:

- `6a43d5521ee828e858d700b3` — ід проекту
- `69fdedc85c91ced88597b14d` — ід чату

### Успішна відповідь

```json
{
  "success": true,
  "message": "Conversation removed from project",
  "conversationId": "69fdedc85c91ced88597b14d"
}
```

### Помилка — проект не знайдено (код 404)

```json
{
  "message": "Project not found"
}
```

### Помилка — діалог не знайдено (код 404)

```json
{
  "message": "Conversation not found in this project"
}
```

### Помилка (код 500)

```json
{
  "message": "Cannot remove conversation from project"
}
```
