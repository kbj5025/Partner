import applyReducer, {
  addApply,
  initialApply,
  initialCompleted,
} from "../../provider/modules/apply";
import { createAction, PayloadAction } from "@reduxjs/toolkit";
import { ApplyItem } from "../../provider/modules/apply";
import { call, put, takeEvery, takeLatest } from "@redux-saga/core/effects";
import api, {
  ApplyItemRequest,
  ApplyItemResponse,
} from "../../pages/api/apply";
import { AxiosResponse } from "axios";

// saga action 생성

// apply를 추가하도록 요청하는 액션
export const requestAddApply = createAction<ApplyItem>(
  `${applyReducer.name}/requestAddApply`
);

// apply를 가져오는 action
export const requestFetchapplys = createAction(
  `${applyReducer.name}/requestFetchApplys`
);

/* ========= saga action을 처리하는 부분 =============== */

// 서버에 post로 데이터를 보내 추가하고, redux state를 변경
function* addData(action: PayloadAction<ApplyItem>) {
  yield console.log("--addData--");
  yield console.log(action);

  // payload 객체
  const applyItemPayload = action.payload;

  // rest api로 보낼 요청객체
  const applyItemRequest: ApplyItemRequest = {
    id: applyItemPayload.id,
    clinicName: applyItemPayload.clinicName,
    clinicSector: applyItemPayload.clinicSector,
    clinicLocate: applyItemPayload.clinicLocate,
    registrationNumber: applyItemPayload.registrationNumber,
    dateOfEstablishment: applyItemPayload.dateOfEstablishment,
    phone: applyItemPayload.phone,
    email: applyItemPayload.email,
    applicantName: applyItemPayload.applicantName,
    admissionApplicationDate: applyItemPayload.admissionApplicationDate,
  };
  // rest api에 post로 데이터를 보냄
  const result: AxiosResponse<ApplyItemResponse> = yield call(
    api.add,
    applyItemRequest
  );
  const applyItem: ApplyItem = {
    id: result.data.id,
    clinicName: result.data.clinicName,
    clinicSector: result.data.clinicSector,
    clinicLocate: result.data.clinicLocate,
    registrationNumber: result.data.registrationNumber,
    dateOfEstablishment: result.data.dateOfEstablishment,
    phone: result.data.phone,
    email: result.data.email,
    applicantName: result.data.applicantName,
    admissionApplicationDate: result.data.admissionApplicationDate,
  };
  // dispatcher(액션)과 동일함
  yield put(addApply(applyItem));

  yield put(initialCompleted());
}

// 서버에서 GET으로 데이터를 가져오고, redux
function* fetchData() {
  // 백엔드에서 데이터 받아오기
  const result: AxiosResponse<ApplyItemResponse[]> = yield call(api.fetch);

  // 응답데이터배열을 액션페이로드 배열로 변환
  const applys = result.data.map(
    (item) =>
      ({
        id: item.id,
        clinicName: item.clinicName,
        clinicSector: item.clinicSector,
        clinicLocate: item.clinicLocate,
        registrationNumber: item.registrationNumber,
        dateOfEstablishment: item.dateOfEstablishment,
        phone: item.phone,
        email: item.email,
        applicantName: item.applicantName,
        admissionApplicationDate: item.admissionApplicationDate,
      } as ApplyItem)
  );
  // state 초기화 reducer 실행
  yield put(initialApply(applys));

  yield put(initialCompleted());
}

// saga action 감지
// apply redux state 처리와 관련된 saga action들을 take할 saga생성
export default function* applySaga() {
  //
  // 동일한 타입의 액션을 모두 처리함
  yield takeEvery(requestAddApply, addData);

  // 동일한 타입의 액션중에서 가장 마지막 액션만 처리
  yield takeLatest(requestFetchapplys, fetchData);
}
