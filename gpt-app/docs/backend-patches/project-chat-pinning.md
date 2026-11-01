# Project-scoped chat pins

Deploy the companion backend patch before the frontend changes in this PR.

Backend repository: `AlexRosly/GPT-titi`.
Patch base: `72de8fd` (patch 31 compute diagnostics).

From the backend repository root:

```sh
git apply --check /path/to/project-chat-pinning.patch
git apply /path/to/project-chat-pinning.patch
node --test test/pinningRules.test.js test/projectConversationPin.test.js
```

The patch adds `PATCH /project/:projectId/conversations/:conversationId/pin`
under the existing API prefix. Body: `{ "pinned": true }` or `false`.
Response: `{ projectId, conversationId, projectPinnedAt }`.

`projectPinnedAt` belongs to the current project membership. Global `pinnedAt`
and the global conversation sort are unchanged. Project reads use the new
field; missing values default to null. No data migration is required and old
global pins are not copied into projects. Moving/removing a chat or deleting
its project clears the membership pin; adding it to the same project again
preserves it. Pins are checked against both user ownership and membership.

The frontend never falls back to the global pin endpoint if this new endpoint
is unavailable. Failed writes leave the displayed pin unchanged and show the
existing error feedback.

Validation: the patch was applied to a clean backend worktree; 14 controller
and pinning-rule tests passed. These tests use model stubs, not a live MongoDB.
Run a server smoke test after deployment: pin/unpin a project chat, reload,
check My Chats is unchanged, move the chat to a second project and check the
project pin is cleared, and confirm another account cannot modify it.

The supplied backend patch is reviewable here because this session has read
access, but no push access, to the backend repository.
