import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./modules/event";
import profileReducer from "./modules/profile";
import progressReducer from "./modules/progress";
import alertReducer from "./modules/alert";
import applyReducer from "./modules/apply";

// global state(전역 상태) 저장소 만듦
export const store = configureStore({
  reducer: {
    // profile state 처리하는 reducer를 등록
    profile: profileReducer,
    event: eventReducer,
    apply: applyReducer,
    progress: progressReducer,
    alert: alertReducer,
  }, // 각 state별로 처리할 reducer 목록
  devTools: true, // 개발툴 사용여부
});

// root state 타입 정의
// 가장 최상위 state
export type RootState = ReturnType<typeof store.getState>;

// dispatch 타입 정의
// dispatch 함수의 generic type
export type AppDispatch = typeof store.dispatch;
