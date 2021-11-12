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
      console.log(apply);
      // const applyItem = state.data.unshift(apply)
      state.data.unshift(apply);
    },
  },
});

export const { addApply } = applySlice.actions;

export default applySlice.reducer;
