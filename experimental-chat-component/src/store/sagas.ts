// import { all, put, takeLatest } from "redux-saga/effects";
// import { v4 as uuidv4 } from "uuid";
// import { addMessages } from "./chatSlice";
// import { IMessage } from "../types/types";

// function* fetchMessagesSaga() {
//   const messages: IMessage[] = yield new Promise((resolve) =>
//     setTimeout(
//       () =>
//         resolve([
//           {
//             id: uuidv4(),
//             body: "This is a simulated message",
//             date: new Date().toISOString(),
//             user: { id: uuidv4(), name: "Bot", avatar: "" },
//           },
//         ]),
//       1000
//     )
//   );
//   yield put(addMessages(messages));
// }

// function* watchFetchMessages() {
//   yield takeLatest("chat/fetchMessages", fetchMessagesSaga);
// }

// export default function* rootSaga() {
//   yield all([watchFetchMessages()]);
// }

export {};
