# Claim Tokens API — Документація

---

## Отримання бонусних токенів

### Запит

| Параметр  | Значення                                                        |
| --------- | --------------------------------------------------------------- |
| Метод     | `POST`                                                          |
| URL       | `https://ypbooking.chost.com.ua/gpt-titi/api/users/claim-token` |
| Заголовок | `Authorization: Bearer <user_token>`                            |
| Body      | —                                                               |

> Тіло запиту передавати не потрібно.

---

### Успішна відповідь — `200 OK`

```json
{
  "code": 200,
  "success": true,
  "message": "Bonus claimed successfully",
  "nextClaimDate": "2026-05-17T15:12:46.957Z",
  "appTokens": 51000
}
```

| Поле            | Тип                 | Опис                                             |
| --------------- | ------------------- | ------------------------------------------------ |
| `code`          | `number`            | HTTP-код відповіді                               |
| `success`       | `boolean`           | Результат операції                               |
| `message`       | `string`            | Повідомлення від сервера                         |
| `nextClaimDate` | `string` (ISO 8601) | Дата, коли можна отримати токени наступного разу |
| `appTokens`     | `number`            | Поточний баланс токенів користувача              |

---

## Помилки

### 1. Занадто рано — `200 OK` / `success: false`

Виникає, якщо з моменту останнього отримання токенів пройшло менше **7 днів**.

```json
{
  "code": 200,
  "success": false,
  "message": "Too early to claim bonus",
  "nextClaimDate": "2026-05-10T15:12:46.957Z",
  "appTokens": 51000
}
```

> **Примітка для фронтенду:** необхідно перевіряти `nextClaimDate` і деактивувати кнопку, якщо дата ще не настала.

---

### 2. Забагато запитів — `429 Too Many Requests`

Виникає якщо кнопку не деактивовано або користувач намагається отримати токени повторно в обхід перевірки.

```
HTTP 429 Too Many Requests
```

```
Too many requests, try later
```

---

### 3. Загальна помилка сервера — `500 Internal Server Error`

```json
{
  "status": 500,
  "message": "Internal server error"
}
```
