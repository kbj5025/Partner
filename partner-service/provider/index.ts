import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./modules/event";
import applyReducer from "./modules/apply";
// 최상위 사가
import rootSaga from "../middleware";
import createSagaMiddleware from "@redux-saga/core";

// saga middleware 생성
const sagaMiddleware = createSagaMiddleware();
//.
// global state(전역 상태) 저장소 만듦
export const store = configureStore({
  reducer: {
    // 각 state별로 처리할 reducer 목록
    event: eventReducer,
    apply: applyReducer,
  },
  devTools: true, // 개발툴 사용여부
  middleware: [sagaMiddleware], // redux store(dispatcher)에 미들웨어 적용
});

// saga middleware를 실행
// rootSaga와 하위에 정의한 감지(take)할 Saga Action들에 대해서 감지 시작
sagaMiddleware.run(rootSaga);

// root state 타입 정의
// 가장 최상위 state
export type RootState = ReturnType<typeof store.getState>;

// dispatch 타입 정의
// dispatch 함수의 generic type
export type AppDispatch = typeof store.dispatch;
