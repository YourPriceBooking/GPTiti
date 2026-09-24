1. Проверка получателя
   После ввода email с задержкой около 300 мс:
   GET /gpt-titi/api/users/token-transfers/recipient?email=alex%40example.com
   Успешный ответ:
   {
   "success": true,
   "canTransfer": true,
   "recipient": {
   "email": "alex@example.com",
   "status": "blocked"
   },
   "appTokens": 594814
   }
   active и blocked разрешены. При изменении email сбрасывать подтверждение и игнорировать ответы от предыдущих запросов.
2. Ввод суммы
   Разрешать отправку, когда получатель подтверждён, сумма — положительное целое число и не превышает appTokens. Кнопка Max подставляет Math.max(0, appTokens).
3. Отправка
   POST /gpt-titi/api/users/token-transfers
   Content-Type: application/json
   {
   "email": "alex@example.com",
   "amount": 1000,
   "clientTransferId": "2d119c58-f40c-4c75-b866-797118cc22ca"
   }
   Создавать clientTransferId через crypto.randomUUID() для каждого нового перевода. При сетевой ошибке повторять тот же запрос с прежним ID. Пока запрос выполняется, блокировать кнопку.
   При успехе показать подтверждение. Если alreadyApplied: false, обновить баланс из appTokens. Если true, это квитанция предыдущего перевода: её баланс может быть устаревшим; актуальный можно получить повторной проверкой получателя.
4. Ошибки
   Сервер возвращает { success: false, code, message }:

- RECIPIENT_DELETED — «Пользователь удалил аккаунт. Перевод невозможен».
- RECIPIENT_NOT_FOUND — «Пользователь не найден».
- SELF_TRANSFER — «Нельзя перевести токены себе».
- INSUFFICIENT_BALANCE — показать нехватку средств и обновить баланс из appTokens.
  Ошибки обрабатывать и при проверке email, и при отправке. Активацию получателя blocked выполняет backend автоматически.
