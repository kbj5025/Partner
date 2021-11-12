import eventReducer, {
  addEvent,
  modifyEvent,
  removeEvent,
  addTotalpages,
  initialCompleted,
  initialNextEvent,
  initialPagedEvent,
  initialEvent,
  initialEventItem,
  EventPage,
} from "../../provider/modules/event";

import { createAction, nanoid, PayloadAction } from "@reduxjs/toolkit";
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
  EventPagingReponse,
} from "../../pages/api/event";

import { AxiosResponse } from "axios";
import { endProgress, startProgress } from "../../provider/modules/progress";
import { addAlert } from "../../provider/modules/alert";
import { RootState } from "../../provider";
import { dataUrlToFile } from "../../lib/string";
import fileApi from "../../pages/api/file";

/* ========= saga action Payload 타입 =============== */
export interface PageRequest {
  page: number;
  size: number;
}

/* ========= saga action을 생성하는 부분 =============== */

// photo를 추가하도록 요청하는 action
// {type:string, payload:PhotoItem}
// {type:"photo/requestAddPhoto", payload: {title, photoUrl...}}

// photo를 추가하도록 요청하는 action creator를 생성
// const actionCreator = createAction<Payload타입>(Action.type문자열)
// 전체 데이터 조횡에서 추가할 때
export const requestAddEvent = createAction<EventItem>(
  `${eventReducer.name}/requestAddEvent`
);

// 숫자 페이징에서 추가할 때
export const requestAddEventPaging = createAction<EventItem>(
  `${eventReducer.name}/requestAddEventPaging`
);

// 더보기 페이징에서 추가할 때
export const requestAddEventNext = createAction<EventItem>(
  `${eventReducer.name}/requestAddEventNext`
);

// photo를 가져오는 action
export const requestFetchEvents = createAction(
  `${eventReducer.name}/requestFetchEvents`
);

// photo를 페이징으로 가져오는 action
export const requestFetchPagingEvents = createAction<PageRequest>(
  `${eventReducer.name}/requestFetchPagingEvents`
);

// 다음 페이지 photo를 가져오는 action
export const requestFetchNextEvents = createAction<PageRequest>(
  `${eventReducer.name}/requestFetchNextEvents`
);

// 1건의 photo만 가져오는 action
export const requestFetchEventItem = createAction<number>(
  `${eventReducer.name}/requestFetchEventItem`
);

// photo를 삭제하는 action
export const requestRemoveEvent = createAction<number>(
  `${eventReducer.name}/requestRemoveEvent`
);

// photo를 삭제하는 action(숫자페이징일때)
export const requestRemoveEventPaging = createAction<number>(
  `${eventReducer.name}/requestRemoveEventPaging`
);

// photo를 삭제하는 action(더보기페이징일때)
export const requestRemoveEventNext = createAction<number>(
  `${eventReducer.name}/requestRemoveEventNext`
);

// photo를 수정하는 action
export const requestModifyEvent = createAction<EventItem>(
  `${eventReducer.name}/requestModifyEvent`
);

/* ========= saga action을 처리하는 부분 =============== */

// 서버에 POST로 데이터를 보내 추가하고, redux state를 변경
function* addDataPaging(action: PayloadAction<EventItem>) {
  yield console.log("--addDataPaging--");
  yield console.log(action);

  try {
    // action의 payload로 넘어온 객체
    const eventItemPayload = action.payload;

    // spinner 보여주기
    yield put(startProgress());

    /* --- (추가로직) 2021-11-01 s3 업로드 처리 --- */
    // 1. dataUrl -> file 변환
    const file: File = yield call(
      dataUrlToFile,
      eventItemPayload.eventPhotoUrl,
      eventItemPayload.title,
      eventItemPayload.price
    );

    // 2. form data 객체 생성
    const formFile = new FormData();
    formFile.set("file", file); // .set("키", 값);

    // 3. multipart/form-data로 업로드
    const fileUrl: AxiosResponse<string> = yield call(fileApi.upload, formFile);
    /*-------------------------------------------------------- */

    // rest api로 보낼 요청객체
    const eventItemRequest: EventItemRequest = {
      title: eventItemPayload.title,
      // title: "", // 임시로 에러 유발(400)
      description: eventItemPayload.description,
      // photoUrl: photoItemPayload.photoUrl, // base64 dataURL
      PhotoUrl: fileUrl.data, // 응답받은 Cloudfront URL로
    };

    // ------ 1. rest api에 post로 데이터 보냄
    // call(함수, 매개변수1, 매개변수2...) -> 함수를 호출함
    // 함수가 Promise를 반환하면, (비동기함수)
    // Saga 미들웨어에서 현재 yield에 대기상태로 있음
    // Promise가 resolve(처리완료)되면 다음 yield로 처리가 진행됨
    // reject(거부/에러)되면 예외를 던짐(throw) -> try ... catch문으로 받을 수 있음.

    // await api.add(photoItemRequest) 이 구문과 일치함
    // 결과값을 형식을 지졍해야함
    const result: AxiosResponse<EventItemResponse> = yield call(
      api.add,
      eventItemRequest
    );

    // spinner 사라지게 하기
    yield put(endProgress());

    // ------ 2. redux state를 변경함
    // **2021-09-28- 페이징 처리 추가 로직
    // 추가하기전에 현재 페이지의 가장 마지막 데이터를 삭제
    // redux state 조회하기
    const eventData: EventItem[] = yield select(
      (state: RootState) => state.event.data
    );

    const eventPageSize: number = yield select(
      (state: RootState) => state.event.pageSize
    );
    // 현재 redux state에 데이터가 있으며, 페이지크기와 데이터 크기가 같으면
    if (eventData.length > 0 && eventData.length == eventPageSize) {
      // redux state의 가장 마지막 요소 삭제
      const deleteId = eventData[eventData.length - 1].id;
      yield put(removeEvent(deleteId));
      // 전체 페이지 수를 증가
      yield put(addTotalpages);
    }

    // 백엔드에서 처리한 데이터 객체로 state를 변경할 payload 객체를 생성
    const eventItem: EventItem = {
      id: result.data.id,
      title: result.data.title,
      description: result.data.description,
      eventPhotoUrl: result.data.eventPhotoUrl,
      clinic: result.data.clinic,
      price: result.data.price,
      keyword: result.data.keyword,
    };

    // dispatcher(액션)과 동일함
    // useDispatch로 dispatcher 만든 것은 컴포넌트에서만 가능
    // put이펙트를 사용함
    yield put(addEvent(eventItem));

    // completed 속성 삭제
    yield put(initialCompleted());

    // alert박스를 추가해줌
    yield put(
      addAlert({ id: nanoid(), variant: "success", message: "저장되었습니다." })
    );
  } catch (e: any) {
    // 에러발생
    // spinner 사라지게 하기
    yield put(endProgress());
    // alert박스를 추가해줌
    yield put(
      addAlert({ id: nanoid(), variant: "danger", message: e.message })
    );
  }
}

function* addDataNext(action: PayloadAction<EventItem>) {
  yield console.log("--addDataNext--");
  yield console.log(action);

  try {
    // action의 payload로 넘어온 객체
    const eventItemPayload = action.payload;

    // spinner 보여주기
    yield put(startProgress());

    /* --- (추가로직) 2021-11-01 s3 업로드 처리 --- */
    // 1. dataUrl -> file 변환
    const file: File = yield call(
      dataUrlToFile,
      eventItemPayload.eventPhotoUrl,
      eventItemPayload.title,
      eventItemPayload.price
    );

    // 2. form data 객체 생성
    const formFile = new FormData();
    formFile.set("file", file);

    // 3. multipart/form-data로 업로드
    const fileUrl: AxiosResponse<string> = yield call(fileApi.upload, formFile);
    /*-------------------------------------------------------- */

    // rest api로 보낼 요청객체
    const eventItemRequest: EventItemRequest = {
      title: eventItemPayload.title,
      // title: "", // 임시로 에러 유발(400)
      description: eventItemPayload.description,
      // photoUrl: photoItemPayload.photoUrl, // base64 dataURL
      PhotoUrl: fileUrl.data, // 응답받은 Cloudfront URL로
    };

    // ------ 1. rest api에 post로 데이터 보냄
    // call(함수, 매개변수1, 매개변수2...) -> 함수를 호출함

    // 함수가 Promise를 반환하면, (비동기함수)
    // Saga 미들웨어에서 현재 yield에 대기상태로 있음
    // Promise가 resolve(처리완료)되면 다음 yield로 처리가 진행됨
    // reject(거부/에러)되면 예외를 던짐(throw) -> try ... catch문으로 받을 수 있음.

    // await api.add(photoItemRequest) 이 구문과 일치함
    // 결과값을 형식을 지졍해야함
    const result: AxiosResponse<EventItemResponse> = yield call(
      api.add,
      eventItemRequest
    );

    // spinner 사라지게 하기
    yield put(endProgress());

    // ------ 2. redux state를 변경함
    // 백엔드에서 처리한 데이터 객체로 state를 변경할 payload 객체를 생성
    const eventItem: EventItem = {
      id: result.data.id,
      title: result.data.title,
      description: result.data.description,
      eventPhotoUrl: result.data.eventPhotoUrl,
      clinic: result.data.clinic,
      keyword: result.data.keyword,
      price: result.data.price,
    };

    // dispatcher(액션)과 동일함
    // useDispatch로 dispatcher 만든 것은 컴포넌트에서만 가능
    // put이펙트를 사용함
    yield put(addEvent(eventItem));

    // completed 속성 삭제
    yield put(initialCompleted());

    // alert박스를 추가해줌
    yield put(
      addAlert({ id: nanoid(), variant: "success", message: "저장되었습니다." })
    );
  } catch (e: any) {
    // 에러발생
    // spinner 사라지게 하기
    yield put(endProgress());
    // alert박스를 추가해줌
    yield put(
      addAlert({ id: nanoid(), variant: "danger", message: e.message })
    );
  }
}

// Redux 사이드 이펙트
// 1. api 연동
// 2. 파일처리
// 3. 처리중 메시지 보여주기/감추기
// 4. 에러메시지 띄우기
// 서버에서 GET으로 데이터를 가저오고, redux state를 초기화
function* fetchData() {
  yield console.log("--fetchData--");

  // spinner 보여주기
  yield put(startProgress());

  // 백엔드에서 데이터 받아오기
  const result: AxiosResponse<EventItemResponse[]> = yield call(api.fetch);

  // spinner 사라지게 하기
  yield put(endProgress());

  // 응답데이터배열을 액션페이로드배열로 변환
  // PhotoItemReponse[] => PhotoItem[]
  const events = result.data.map(
    (item) =>
      ({
        id: item.id,
        title: item.title,
        description: item.description,
        eventPhotoUrl: item.eventPhotoUrl,
        clinic: item.clinic,
        price: item.price,
        keyword: item.keyword,
      } as EventItem)
  );

  // state 초기화 reducer 실행
  yield put(initialEvent(events));
}

// 숫자 페이징 목록 조회
function* fetchPagingData(action: PayloadAction<PageRequest>) {
  yield console.log("--fetchPagingData--");

  const page = action.payload.page;
  const size = action.payload.size;

  localStorage.setItem("event_page_size", size.toString());

  // spinner 보여주기
  yield put(startProgress());

  try {
    // 백엔드에서 데이터 받아오기
    const result: AxiosResponse<EventPagingReponse> = yield call(
      api.fetchPaging,
      page,
      size
    );

    // spinner 사라지게 하기
    yield put(endProgress());

    // 받아온 페이지 데이터를 Payload 변수로 변환
    const photoPage: EventPage = {
      // 응답데이터배열을 액션페이로드배열로 변환
      // PhotoItemReponse[] => PhotoItem[]
      data: result.data.content.map(
        (item) =>
          ({
            id: item.id,
            title: item.title,
            description: item.description,
            eventPhotoUrl: item.eventPhotoUrl,
            clinic: item.clinic,
            price: item.price,
            keyword: item.keyword,
          } as EventItem)
      ),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      page: result.data.number,
      pageSize: result.data.size,
      isLast: result.data.last,
    };

    // state 초기화 reducer 실행
    yield put(initialPagedEvent(photoPage));
  } catch (e: any) {
    // 에러발생
    // spinner 사라지게 하기
    yield put(endProgress());
    // alert박스를 추가해줌
    yield put(
      addAlert({ id: nanoid(), variant: "danger", message: e.message })
    );
  }
}

// 더보기 목록 조회
function* fetchNextData(action: PayloadAction<PageRequest>) {
  yield console.log("--fetchNextData--");

  const page = action.payload.page;
  const size = action.payload.size;

  // spinner 보여주기
  yield put(startProgress());

  try {
    // 백엔드에서 데이터 받아오기
    const result: AxiosResponse<EventPagingReponse> = yield call(
      api.fetchPaging,
      page,
      size
    );

    // spinner 사라지게 하기
    yield put(endProgress());

    // 받아온 페이지 데이터를 Payload 변수로 변환
    const eventPage: EventPage = {
      // 응답데이터배열을 액션페이로드배열로 변환
      // PhotoItemReponse[] => PhotoItem[]
      data: result.data.content.map(
        (item) =>
          ({
            id: item.id,
            title: item.title,
            description: item.description,
            eventPhotoUrl: item.eventPhotoUrl,
            clinic: item.clinic,
            price: item.price,
            keyword: item.keyword,
          } as EventItem)
      ),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      page: result.data.number,
      pageSize: result.data.size,
      isLast: result.data.last,
    };

    // state 초기화 reducer 실행
    yield put(initialNextEvent(eventPage));
  } catch (e: any) {
    // 에러발생
    // spinner 사라지게 하기
    yield put(endProgress());
    // alert박스를 추가해줌
    yield put(
      addAlert({ id: nanoid(), variant: "danger", message: e.message })
    );
  }
}
// 1건의 데이터만 조회
function* fetchDataItem(action: PayloadAction<number>) {
  yield console.log("--fetchDataItem--");

  const id = action.payload;

  // 백엔드에서 데이터 받아오기
  const result: AxiosResponse<EventItemResponse> = yield call(api.get, id);

  const event = result.data;
  if (event) {
    // state 초기화 reducer 실행
    yield put(initialEventItem(event));
  }
}

// 삭제처리
function* removeDataPaging(action: PayloadAction<number>) {
  yield console.log("--removeData--");

  // id값
  const id = action.payload;

  // spinner 보여주기
  yield put(startProgress());

  /* --- (추가로직) 2021-11-01 S3 파일 삭제 로직 추가 --- */
  // redux state에서 id로
  // object key 가져오기 예) https://배포Id.cloudfront.net/objectKey
  const eventItem: EventItem = yield select((state: RootState) =>
    state.event.data.find((item) => item.id === id)
  );
  const urlArr = eventItem.eventPhotoUrl.split("/");
  const objectKey = urlArr[urlArr.length - 1];

  // file api 호출해서 s3에 파일 삭제
  yield call(fileApi.remove, objectKey);
  /* ------------------------------------------------- */

  // rest api 연동
  const result: AxiosResponse<boolean> = yield call(api.remove, id);

  // spinner 사라지게 하기
  yield put(endProgress());

  // 반환 값이 true이면
  if (result.data) {
    // state 변경(1건삭제)
    yield put(removeEvent(id));
  } else {
    // alert박스를 추가해줌
    yield put(
      addAlert({
        id: nanoid(),
        variant: "danger",
        message: "오류로 저장되지 않았습니다.",
      })
    );
  }

  // completed 속성 삭제
  yield put(initialCompleted());

  // 현재 페이지 데이터를 다시 가져옴
  // 현재 페이지와 사이즈 값을 읽어옴
  const page: number = yield select((state: RootState) => state.event.page);
  const size: number = yield select((state: RootState) => state.event.pageSize);

  yield put(requestFetchPagingEvents({ page, size }));
}

function* removeDataNext(action: PayloadAction<number>) {
  yield console.log("--removeDataNext--");

  // id값
  const id = action.payload;

  // spinner 보여주기
  yield put(startProgress());

  /* --- (추가로직) 2021-11-01 S3 파일 삭제 로직 추가 --- */
  // redux state에서 id로
  // object key 가져오기 예) https://배포Id.cloudfront.net/objectKey
  const EventItem: EventItem = yield select((state: RootState) =>
    state.event.data.find((item) => item.id === id)
  );
  const urlArr = EventItem.eventPhotoUrl.split("/");
  const objectKey = urlArr[urlArr.length - 1];

  // file api 호출해서 s3에 파일 삭제
  yield call(fileApi.remove, objectKey);
  /* ------------------------------------------------- */

  // rest api 연동
  const result: AxiosResponse<boolean> = yield call(api.remove, id);

  // spinner 사라지게 하기
  yield put(endProgress());

  // 반환 값이 true이면
  if (result.data) {
    // state 변경(1건삭제)
    yield put(removeEvent(id));
  } else {
    // alert박스를 추가해줌
    yield put(
      addAlert({
        id: nanoid(),
        variant: "danger",
        message: "오류로 저장되지 않았습니다.",
      })
    );
  }

  // completed 속성 삭제
  yield put(initialCompleted());
}

// 수정처리
function* modifyData(action: PayloadAction<EventItem>) {
  yield console.log("--modifyData--");

  // action의 payload로 넘어온 객체
  const eventItemPayload = action.payload;

  // // spinner 보여주기
  yield put(startProgress());

  // 파일이 바뀌었으면 base64파일
  let fileUrl = action.payload.eventPhotoUrl;
  if (action.payload.eventPhotoUrl.startsWith("data")) {
    /*--- (추가로직) 2021-11-01 S3 파일 삭제 로직 추가 --- */
    // redux state에서 id로
    // object key 가져오기 예) https://배포Id.cloudfront.net/objectKey
    const eventItemFile: EventItem = yield select((state: RootState) =>
      state.event.data.find((item) => item.id === eventItemPayload.id)
    );
    const urlArr = eventItemFile.eventPhotoUrl.split("/");
    const objectKey = urlArr[urlArr.length - 1];

    // file api 호출해서 s3에 파일 삭제
    yield call(fileApi.remove, objectKey);
    /* --- ------------------------------------------------ */

    /* --- (추가로직) 2021-11-01 s3 업로드 처리 --- */
    // 1. dataUrl -> file 변환
    const file: File = yield call(
      dataUrlToFile,
      eventItemPayload.eventPhotoUrl,
      eventItemPayload.title,
      eventItemPayload.price
    );

    // 2. form data 객체 생성
    const formFile = new FormData();
    formFile.set("file", file);

    // 3. multipart/form-data로 업로드
    const fileRes: AxiosResponse<string> = yield call(fileApi.upload, formFile);
    fileUrl = fileRes.data;
    /*-------------------------------------------------------- */
  }

  // rest api로 보낼 요청객체
  const EventItemRequest: EventItemRequest = {
    title: eventItemPayload.title,
    description: eventItemPayload.description,
    // photoUrl: photoItemPayload.photoUrl,
    PhotoUrl: fileUrl,
  };

  const result: AxiosResponse<EventItemResponse> = yield call(
    api.modify,
    eventItemPayload.id,
    EventItemRequest
  );

  // // spinner 사라지게 하기
  yield put(endProgress());

  // 백엔드에서 처리한 데이터 객체로 state를 변경할 payload 객체를 생성
  const eventItem: EventItem = {
    id: result.data.id,
    title: result.data.title,
    description: result.data.description,
    eventPhotoUrl: result.data.eventPhotoUrl,
    clinic: result.data.clinic,
    price: result.data.price,
    keyword: result.data.keyword,
  };

  // state 변경
  yield put(modifyEvent(eventItem));

  // completed 속성 삭제
  yield put(initialCompleted());
}

/* ========= saga action을 감지(take)하는 부분 =============== */
// photo redux state 처리와 관련된 saga action들을 감지(take)할 saga를 생성
// saga는 generator 함수로 작성
export default function* eventSaga() {
  // takeEvery(처리할액션, 액션을처리할함수)
  // 동일한 타입의 액션은 모두 처리함
  yield takeEvery(requestAddEvent, addDataNext);
  yield takeEvery(requestAddEventPaging, addDataPaging);
  yield takeEvery(requestAddEventNext, addDataNext);

  // takeLatest(처리할액션, 액션을처리할함수)
  // 동일한 타입의 액션중에서 가장 마지막 액션만 처리, 이전 액션은 취소

  // 1건의 데이터만 조회
  yield takeEvery(requestFetchEventItem, fetchDataItem);
  yield takeLatest(requestFetchEvents, fetchData);
  yield takeLatest(requestFetchPagingEvents, fetchPagingData);
  yield takeLatest(requestFetchNextEvents, fetchNextData);

  // 삭제처리
  yield takeEvery(requestRemoveEvent, removeDataNext);
  yield takeEvery(requestRemoveEventPaging, removeDataPaging);
  yield takeEvery(requestRemoveEventNext, removeDataNext);

  // 수정처리
  yield takeEvery(requestModifyEvent, modifyData);
}
