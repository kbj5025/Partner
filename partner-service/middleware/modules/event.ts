import eventReducer, {
  addEvent,
  removeEvent,
  modifyEvent,
  initialEvent,
  initialCompleted,
} from "../../provider/modules/event";
import { createAction, PayloadAction } from "@reduxjs/toolkit";
import { EventItem } from "../../provider/modules/event";
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from "@redux-saga/core/effects";
import api, {
  EventItemRequest,
  EventItemResponse,
} from "../../pages/api/event";
import { dataUrlToFile } from "../../lib/string";
import fileApi from "../../pages/api/file";
import { AxiosResponse } from "axios";
import { RootState } from "../../provider";

// saga action 생성

// event를 추가하도록 요청하는 액션
export const requestAddEvent = createAction<EventItem>(
  `${eventReducer.name}/requestAddEvent`
);

// event를 삭제하는 action
export const requestRemoveEvent = createAction<number>(
  `${eventReducer.name}/requestRemoveEvent`
);

// event를 수정하는 action
export const requestModifyEvent = createAction<EventItem>(
  `${eventReducer.name}/requestModifyEvent`
);

// event를 가져오는 action
export const requestFetchEvents = createAction(
  `${eventReducer.name}/requestFetchEvents`
);

/* ========= saga action을 처리하는 부분 =============== */

// 서버에서 GET으로 데이터를 가져오고, redux
function* fetchData() {
  // 백엔드에서 데이터 받아오기
  const result: AxiosResponse<EventItemResponse[]> = yield call(api.fetch);

  // 응답데이터배열을 액션페이로드 배열로 변환
  const events = result.data.map(
    (item) =>
      ({
        id: item.id,
        title: item.title,
        description: item.description,
        photoUrl: item.photoUrl,
        clinic: item.clinic,
        price: item.price,
        keyword: item.keyword,
        fileType: item.fileType,
        fileName: item.fileName,
        createdTime: item.createdTime,
      } as EventItem)
  );
  // state 초기화 reducer 실행
  yield put(initialEvent(events));
}

// 서버에 post로 데이터를 보내 추가하고, redux state를 변경
function* addDataNext(action: PayloadAction<EventItem>) {
  yield console.log("--addData--");
  yield console.log(action);

  // payload 객체

  const eventItemPayload = action.payload;

  /* ------------ s3 업로드 처리 --------------- */
  // 1. dataUrl -> file 변환
  const file: File = yield call(
    dataUrlToFile,
    eventItemPayload.photoUrl,
    eventItemPayload.fileName,
    eventItemPayload.fileType
  );

  // 2.form data 객체 생성
  const formFile = new FormData();
  formFile.set("file", file);

  // 3. multipart/form-data로 업로드
  const fileUrl: AxiosResponse<string> = yield call(fileApi.upload, formFile);
  /* --------------------------------------- */

  // rest api로 보낼 요청객체
  const eventItemRequest: EventItemRequest = {
    id: eventItemPayload.id,
    title: eventItemPayload.title,
    description: eventItemPayload.description
      ? eventItemPayload.description
      : "",
    clinic: eventItemPayload.clinic,
    keyword: eventItemPayload.keyword,
    price: eventItemPayload.price,
    photoUrl: fileUrl.data,
    fileType: eventItemPayload.fileType,
    fileName: eventItemPayload.fileName,
    createdTime: eventItemPayload.createdTime,
  };

  // rest api에 post로 데이터 보냄
  const result: AxiosResponse<EventItemResponse> = yield call(
    api.add,
    eventItemRequest
  );
  // redux state를 변경함
  const eventItem: EventItem = {
    id: result.data.id,
    title: result.data.title,
    description: result.data.description,
    photoUrl: result.data.photoUrl,
    clinic: result.data.clinic,
    price: result.data.price,
    keyword: result.data.keyword,
    fileType: result.data.fileType,
    fileName: result.data.fileName,
    createdTime: result.data.createdTime,
  };
  // dispatcher(액션)과 동일함
  yield put(addEvent(eventItem));

  // completed 속성 삭제
  yield put(initialCompleted());
}

// 삭제 처리
function* removeDataNext(action: PayloadAction<number>) {
  yield console.log("--removeDataNext--");
  // id값
  const id = action.payload;
  console.log(id);

  /* ----- s3 파일 삭제 로직 ----- */
  // redux state에서 id로 object key 가져오기
  const eventItem: EventItem = yield select((state: RootState) =>
    state.event.data.find((item) => item.id === id)
  );

  // file api 호출해서 s3에 파일 삭제
  if (eventItem.photoUrl !== "") {
    const urlArr = eventItem.photoUrl.split("/");
    const objectKey = urlArr[urlArr.length - 1];
    yield call(fileApi.remove, objectKey);
  }
  /* ----- s3 파일 삭제 로직 끝 ----- */

  // rest api 연동
  const result: AxiosResponse<boolean> = yield call(api.remove, id);
  // 반환 값이 true이면
  if (result.data) {
    // state 변경(1건삭제)
    yield put(removeEvent(id));
  }
  yield put(initialCompleted());
}

// 수정처리
function* modifyDataNext(action: PayloadAction<EventItem>) {
  yield console.log("--modifyData--");
  // action의 payload로 넘어온 객체
  const eventItemPayload = action.payload;
  // rest api로 보낼 요청객체
  const eventItemRequest: EventItemRequest = {
    id: eventItemPayload.id,
    title: eventItemPayload.title,
    description: eventItemPayload.description
      ? eventItemPayload.description
      : "",
    photoUrl: eventItemPayload.photoUrl,
    clinic: eventItemPayload.clinic,
    keyword: eventItemPayload.keyword,
    price: eventItemPayload.price,
    fileType: eventItemPayload.fileType,
    fileName: eventItemPayload.fileName,
    createdTime: eventItemPayload.createdTime,
  };
  const result: AxiosResponse<EventItemResponse> = yield call(
    api.modify,
    eventItemPayload.id,
    eventItemRequest
  );
  const eventItem: EventItem = {
    id: result.data.id,
    title: result.data.title,
    description: result.data.description,
    photoUrl: result.data.photoUrl,
    clinic: result.data.clinic,
    price: result.data.price,
    keyword: result.data.keyword,
    fileType: result.data.fileType,
    fileName: result.data.fileName,
    createdTime: result.data.createdTime,
  };
  // state 변경
  yield put(modifyEvent(eventItem));

  yield put(initialCompleted());
}

// saga action 감지
// event redux state 처리와 관련된 saga action들을 take할 saga생성
export default function* eventSaga() {
  // 동일한 타입의 액션중에서 가장 마지막 액션만 처리
  yield takeLatest(requestFetchEvents, fetchData);

  // 동일한 타입의 액션을 모두 처리함
  yield takeEvery(requestAddEvent, addDataNext);
  // 수정처리
  yield takeEvery(requestModifyEvent, modifyDataNext);
  // 삭제처리
  yield takeEvery(requestRemoveEvent, removeDataNext);
}
