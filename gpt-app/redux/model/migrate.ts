import type { PersistedState } from "redux-persist";
import { DEFAULT_MODEL, DEFAULT_MODEL_GROUP, modelConfig } from "../../config/models.config";

// Rehydration bypasses reducers: validate old preferences before they reach the UI.
// Conversation records and message model IDs are not part of this migration.
export async function migrateModelSelection(state: PersistedState): Promise<PersistedState> {
  if (!state) return state;
  const saved = state as PersistedState & { selectedModel?: unknown };
  const group = Object.entries(modelConfig).find(([, config]) =>
    config.list.some((item) => item.title === saved.selectedModel),
  )?.[0];
  return {
    ...state,
    selectedModel: group ? saved.selectedModel : DEFAULT_MODEL,
    selectedModelGroup: group ?? DEFAULT_MODEL_GROUP,
  } as PersistedState;
}
