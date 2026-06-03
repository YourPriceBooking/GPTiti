# Rename Conversation API

## Endpoint

```
PATCH https://ypbooking.chost.com.ua/gpt-titi/api/conversations/rename-conversation
```

## Headers

| Назва           | Опис                            |
| --------------- | ------------------------------- |
| `Authorization` | Токен користувача (обов'язково) |

## Request Body

```json
{
  "id": "69fdedc85c91ced88597b14d",
  "title": "My New chat with gpt-4o-mini"
}
```

| Поле    | Тип      | Опис                            |
| ------- | -------- | ------------------------------- |
| `id`    | `string` | ID діалогу, який перейменовуємо |
| `title` | `string` | Нова назва діалогу              |

## Відповіді

### ✅ 200 — Успіх

Діалог успішно перейменовано.

---

### ❌ 404 — Діалог не знайдено

Повертається, якщо передано невірний ID, чат не існує або був видалений.

```json
{
  "error": "Conversation not found"
}
```

---

### ❌ 500 — Внутрішня помилка сервера

Повертається у разі непередбаченої помилки.

```json
{
  "status": 500,
  "message": "Internal server error"
}
```
