# Chat request ordering backend patch

Apply to the backend repository `AlexRosly/GPT-titi`, tested against
`0936e47c3111e005785d69506b1e855bc6495dda`. Deploy the backend first so the
frontend can restore the order after reload. No data migration is required.

```sh
git apply --check /path/to/chat-request-order.patch
git apply /path/to/chat-request-order.patch
node --test test/chatDeliveryV2/acceptDuplicate.test.js test/pinningRules.test.js test/projectConversationPin.test.js test/projectPinPipeline.test.js test/chatDeliveryV2.protocol.test.js
npm run test:chat-v2:integration # Requires CHAT_V2_TEST_MONGO_URI for a test replica set.
```

A new V2 turn updates its conversation's `lastRequestAt` inside the acceptance
transaction. Duplicate sends do not update it. Reply completion still updates
`lastMessageAt` separately. The conversation list and project detail return
`lastRequestAt`; neither global nor project pin timestamps change.

After deployment, send a message in an unpinned chat and verify it rises above
pins. Send in a pinned chat and verify it leads its pinned group. Repeat from
a project (check both sidebar and project page), then reload. Verify global
and project pins retain their existing state.
