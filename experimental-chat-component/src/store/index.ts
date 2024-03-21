import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import chatReducer from "./chatSlice";
import roomMessagesReducer from "./roomMessagesSlice";
import loginReducer from "./loginSlice";
import rootSaga from "./sagas";
import chatSettingsReducer from "./chatSettingsSlice";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  chat: chatReducer,
  roomMessages: roomMessagesReducer,
  loginStore: loginReducer,
  chatSettingStore: chatSettingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["chat/addMessage"],
        ignoredPaths: ["chat.messages.timestamp"],
        serializableCheck: false,
      },
    }).concat(sagaMiddleware),
});

export type RootState = ReturnType<typeof rootReducer>;

sagaMiddleware.run(rootSaga);
