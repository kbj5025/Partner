import { fork } from "redux-saga/effects";
import eventSaga from "./modules/event";

// 최상위 Saga를 내보내기함
// 그 하위, reviewSaga
// 기능별 각각의 saga action별로 처리할 saga들을 넣어줌
export default function* rootSaga() {
  // 비동기로 하위 사가를 처리함
  yield fork(eventSaga);
}
