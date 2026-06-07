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
import storage from "redux-persist/lib/storage";

import { authReducer } from "./auth/slice";
import { chatReducer } from "./chat/slice";
import { modelReducer } from "./model/slice";
import { tokensReducer } from "./tokens/slice";
import { uiReducer } from "./ui/slice";
import { setupInterceptors } from "@/lib/axiosInstance"; // ← додано

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user", "isLoggedIn"],
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

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  chat: chatReducer,
  model: persistReducer(modelPersistConfig, modelReducer),
  tokens: persistReducer(tokensPersistConfig, tokensReducer),
  ui: uiReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupInterceptors(store); // ← викликаємо після створення store

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; // ← додано для типу в axiosInstance
