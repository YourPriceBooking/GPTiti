import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import type { PersistedState } from "redux-persist/es/types";
import storage from "redux-persist/lib/storage";

import { authReducer } from "./auth/slice";
import { chatReducer } from "./chat/slice";
import { modelReducer } from "./model/slice";
import { tokensReducer } from "./tokens/slice";
import { uiReducer } from "./ui/slice";
import { projectsReducer } from "./projects/slice";
import { errorToastMiddleware } from "./errorToastMiddleware";
import { setupInterceptors } from "@/lib/axiosInstance"; // ← додано

const removeLegacyPersistedToken = async (
  state: PersistedState,
): Promise<PersistedState> => {
  if (!state) return state;

  // redux-persist's whitelist only filters future writes. Existing installs
  // must explicitly remove the credential during rehydration.
  const migrated = state as PersistedState & { accessToken?: unknown };
  delete migrated.accessToken;
  return migrated;
};

const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
  whitelist: ["user", "isLoggedIn"],
  migrate: removeLegacyPersistedToken,
};

const modelPersistConfig = {
  key: "model",
  storage,
};

const tokensPersistConfig = {
  key: "tokens",
  storage,
  whitelist: ["balance", "nextClaimTime"],
};

const chatPersistConfig = {
  key: "chat",
  version: 2,
  storage,
  whitelist: ["activeChatId", "pendingTurns"],
};

const projectsPersistConfig = {
  key: "projects",
  storage,
  whitelist: ["list"],
};

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["activeProjectId"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  chat: persistReducer(chatPersistConfig, chatReducer),
  model: persistReducer(modelPersistConfig, modelReducer),
  tokens: persistReducer(tokensPersistConfig, tokensReducer),
  projects: persistReducer(projectsPersistConfig, projectsReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(errorToastMiddleware),
});

setupInterceptors(store); // ← викликаємо після створення store

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; // ← додано для типу в axiosInstance
