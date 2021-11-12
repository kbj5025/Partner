import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ApplyItem {
  id: number;
  clinicName: string;
  clinicSector: string;
  clinicLocate: string;
  registrationNumber: string;
  dateOfEstablishment: string;
  phone: string;
  email: string;
  applicantName: string;
  admissionApplicationDate: string;
}

// state 타입
export interface ApplyState {
  data: ApplyItem[]; // 아이템 배열
  isFetched: boolean; // 서버에서 데이터를 받아온지에 대한 정보
  isAddCompleted?: boolean; // 데이터 추가가 완료되었는지 여부
  isRemoveCompleted?: boolean; // 데이터 삭제가 완료되었는지 여부
  isModifyCompleted?: boolean; // 데이터 수정이 완료되었는지 여부
}

const initialState: ApplyState = {
  data: [],
  isFetched: false,
};

const applySlice = createSlice({
  name: "apply",
  initialState,
  reducers: {
    addApply: (state, action: PayloadAction<ApplyItem>) => {
      const apply = action.payload;
      state.data.unshift(apply);
      state.isAddCompleted = true; // 추가가 되었음으로 표시
    },
    // payload값으로 state를 초기화하는 reducer 필요함
    initialApply: (state, action: PayloadAction<ApplyItem[]>) => {
      const applys = action.payload;
      // 백엔드에서 받아온 데이터
      state.data = applys;
      // 데이터를 받아옴으로 값을 남김
      state.isFetched = true;
    },
  },
});

// action creator 내보내기: action creator는 action객체를 반환하는 함수
export const { addApply, initialApply } = applySlice.actions;

export default applySlice.reducer;
