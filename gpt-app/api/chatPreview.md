# Chat API — Документація

---

## 1. Отримання історії повідомлень

Повертає **20 останніх повідомлень**.

### Запит

| Параметр  | Значення                                          |
| --------- | ------------------------------------------------- |
| Метод     | `GET`                                             |
| URL       | `http://localhost:7000/gpt-titi/api/chat/history` |
| Заголовок | `Authorization: Bearer <user_token>`              |

---

### Успішна відповідь — `200 OK`

```json
{
  "messages": [
    {
      "_id": "69ff1f9fcd61ba1c8ce8dc21",
      "role": "assistant",
      "content": "Да, конечно! Напиши, пожалуйста, что конкретно нужно сделать по домашнему заданию: задания, темы, вопросы и т.д. Я постараюсь тебе помочь!",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:50:55.574Z"
    },
    {
      "_id": "69ff1f9dcd61ba1c8ce8dc1d",
      "role": "user",
      "content": "Можешь помочь сделать дз по немецкому\n",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:50:53.643Z"
    },
    {
      "_id": "69ff1f5ef31f6251cf1efaf1",
      "role": "assistant",
      "content": "Конечно, я с радостью помогу тебе с домашним заданием по немецкому языку! Пожалуйста, расскажи, что именно тебе нужно сделать. Какие темы или задания у тебя есть?",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:49:50.353Z"
    },
    {
      "_id": "69ff1f5cf31f6251cf1efaed",
      "role": "user",
      "content": "Можешь помочь сделать дз по немецкому\n",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:49:48.372Z"
    },
    {
      "_id": "69ff1dc1f3f855256daf8c2f",
      "role": "assistant",
      "content": "На данный момент самым быстрым серийным автомобилем считается **Bugatti Chiron Super Sport 300+**...",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:42:57.575Z"
    },
    {
      "_id": "69ff1db9f3f855256daf8c2b",
      "role": "user",
      "content": "какое авто самое быстрое\n",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:42:49.198Z"
    },
    {
      "_id": "69ff1cd955a5a569f60a093b",
      "role": "assistant",
      "content": "На данный момент у меня нет доступа к актуальным новостям...",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:39:05.895Z"
    },
    {
      "_id": "69ff1cd555a5a569f60a0937",
      "role": "user",
      "content": "какая ситуация на фронте",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-09T11:39:01.091Z"
    },
    {
      "_id": "69fe445f1344bbc10decc16c",
      "role": "assistant",
      "content": "Конечно! Давай я расскажу тебе новую историю...",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-08T20:15:27.278Z"
    },
    {
      "_id": "69fe444f1344bbc10decc168",
      "role": "user",
      "content": "Расскажи историю",
      "modelId": "gpt-4o-mini",
      "createdAt": "2026-05-08T20:15:11.108Z"
    }
  ]
}
```

### Поля повідомлення

| Поле        | Тип                       | Опис                                            |
| ----------- | ------------------------- | ----------------------------------------------- |
| `_id`       | `string`                  | Унікальний ідентифікатор повідомлення           |
| `role`      | `"user"` \| `"assistant"` | Роль відправника                                |
| `content`   | `string`                  | Текст повідомлення                              |
| `modelId`   | `string`                  | Ідентифікатор моделі (наприклад, `gpt-4o-mini`) |
| `createdAt` | `string` (ISO 8601)       | Дата і час створення                            |

---

### Відповідь при помилці — `500 Internal Server Error`

```json
{
  "status": 500,
  "message": "Internal server error"
}
```
